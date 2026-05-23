-- ============================================================
-- HabitQuest Database Schema
-- Run this in the Supabase SQL Editor (in order)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'custom');
CREATE TYPE habit_difficulty AS ENUM ('easy', 'medium', 'hard', 'legendary');
CREATE TYPE habit_category AS ENUM (
  'fitness', 'nutrition', 'sleep', 'mindfulness',
  'learning', 'creativity', 'social', 'productivity',
  'finance', 'hygiene', 'nature', 'custom'
);
CREATE TYPE quest_type AS ENUM ('daily', 'weekly', 'seasonal', 'one_time');
CREATE TYPE party_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE mood AS ENUM ('awful', 'bad', 'neutral', 'good', 'great');
CREATE TYPE achievement_category AS ENUM (
  'streak', 'completion', 'social', 'exploration',
  'level', 'special', 'seasonal'
);
CREATE TYPE cosmetic_type AS ENUM ('hat', 'cape', 'pet', 'background', 'frame', 'emote');

-- ============================================================
-- COSMETIC ITEMS (define before profiles foreign key)
-- ============================================================
CREATE TABLE cosmetic_items (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  type            cosmetic_type NOT NULL,
  sprite_key      TEXT NOT NULL,
  rarity          TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  xp_cost         INTEGER,
  is_premium      BOOLEAN NOT NULL DEFAULT false,
  unlock_criteria JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  display_name    TEXT NOT NULL DEFAULT '',
  avatar_url      TEXT,
  bio             TEXT DEFAULT '' CHECK (length(bio) <= 280),
  identity_statement TEXT DEFAULT '',

  xp              INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level           INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 100),
  total_habits_completed INTEGER NOT NULL DEFAULT 0,

  active_hat      TEXT REFERENCES cosmetic_items(id) ON DELETE SET NULL,
  active_cape     TEXT REFERENCES cosmetic_items(id) ON DELETE SET NULL,
  active_pet      TEXT REFERENCES cosmetic_items(id) ON DELETE SET NULL,
  active_background TEXT REFERENCES cosmetic_items(id) ON DELETE SET NULL,
  active_frame    TEXT REFERENCES cosmetic_items(id) ON DELETE SET NULL,

  avatar_skin_tone TEXT NOT NULL DEFAULT '#F5CBA7',
  avatar_hair_style TEXT NOT NULL DEFAULT 'default',
  avatar_hair_color TEXT NOT NULL DEFAULT '#5D4037',
  avatar_outfit    TEXT NOT NULL DEFAULT 'starter',

  timezone        TEXT NOT NULL DEFAULT 'UTC',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  sound_enabled   BOOLEAN NOT NULL DEFAULT true,
  public_profile  BOOLEAN NOT NULL DEFAULT true,
  show_on_leaderboard BOOLEAN NOT NULL DEFAULT true,

  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  onboarding_step INTEGER NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'preferred_username',
      REGEXP_REPLACE(SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1), '[^a-z0-9_]', '', 'g')
        || '_' || SUBSTR(NEW.id::TEXT, 1, 4)
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================
-- USER COSMETICS
-- ============================================================
CREATE TABLE user_cosmetics (
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cosmetic_id     TEXT NOT NULL REFERENCES cosmetic_items(id) ON DELETE CASCADE,
  acquired_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, cosmetic_id)
);

-- ============================================================
-- HABITS
-- ============================================================
CREATE TABLE habits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  description     TEXT DEFAULT '' CHECK (length(description) <= 500),
  category        habit_category NOT NULL DEFAULT 'custom',
  frequency       habit_frequency NOT NULL DEFAULT 'daily',
  frequency_days  INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  difficulty      habit_difficulty NOT NULL DEFAULT 'medium',
  xp_reward       INTEGER NOT NULL DEFAULT 50,
  icon            TEXT NOT NULL DEFAULT '⭐',
  color           TEXT NOT NULL DEFAULT '#4CAF50',
  grace_days      INTEGER NOT NULL DEFAULT 1 CHECK (grace_days >= 0 AND grace_days <= 3),
  biome_id        TEXT NOT NULL DEFAULT 'forest',
  is_archived     BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX habits_user_id_idx ON habits(user_id) WHERE NOT is_archived;

CREATE TRIGGER habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================
-- HABIT LOGS
-- ============================================================
CREATE TABLE habit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id        UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  completed       BOOLEAN NOT NULL DEFAULT true,
  mood            mood,
  note            TEXT DEFAULT '' CHECK (length(note) <= 280),
  xp_awarded      INTEGER NOT NULL DEFAULT 0,
  streak_at_log   INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(habit_id, log_date)
);

CREATE INDEX habit_logs_user_date_idx ON habit_logs(user_id, log_date DESC);
CREATE INDEX habit_logs_habit_id_idx ON habit_logs(habit_id, log_date DESC);

-- ============================================================
-- STREAKS
-- ============================================================
CREATE TABLE streaks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id        UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE UNIQUE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak  INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak  INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  grace_days_used INTEGER NOT NULL DEFAULT 0,
  last_grace_date DATE,
  last_completed_date DATE,
  first_completed_date DATE,
  total_completions INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX streaks_user_id_idx ON streaks(user_id);

-- Streak recalculation trigger
CREATE OR REPLACE FUNCTION recalculate_streak()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_habit habits%ROWTYPE;
  v_streak streaks%ROWTYPE;
  v_xp_reward INTEGER;
BEGIN
  IF NEW.completed = false THEN RETURN NEW; END IF;

  SELECT * INTO v_habit FROM habits WHERE id = NEW.habit_id;
  SELECT * INTO v_streak FROM streaks WHERE habit_id = NEW.habit_id FOR UPDATE;

  v_xp_reward := CASE v_habit.difficulty
    WHEN 'easy'      THEN 25
    WHEN 'medium'    THEN 50
    WHEN 'hard'      THEN 100
    WHEN 'legendary' THEN 200
    ELSE 50
  END;

  -- Streak bonus: +10% per 7-day tier, max 100% bonus
  IF v_streak IS NOT NULL AND v_streak.current_streak >= 7 THEN
    v_xp_reward := v_xp_reward + LEAST(v_xp_reward,
      (v_xp_reward * 0.1 * (v_streak.current_streak / 7))::INTEGER
    );
  END IF;

  UPDATE habit_logs SET xp_awarded = v_xp_reward WHERE id = NEW.id;

  IF v_streak IS NULL THEN
    INSERT INTO streaks (habit_id, user_id, current_streak, longest_streak,
                         last_completed_date, first_completed_date, total_completions)
    VALUES (NEW.habit_id, NEW.user_id, 1, 1, NEW.log_date, NEW.log_date, 1);
  ELSIF v_streak.last_completed_date = NEW.log_date - INTERVAL '1 day' THEN
    UPDATE streaks SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_completed_date = NEW.log_date,
      total_completions = total_completions + 1,
      grace_days_used = 0,
      updated_at = NOW()
    WHERE habit_id = NEW.habit_id;
  ELSIF v_streak.last_completed_date <= NEW.log_date - INTERVAL '2 days'
        AND v_habit.grace_days >= 1
        AND COALESCE(v_streak.grace_days_used, 0) < v_habit.grace_days
        AND v_streak.last_completed_date >= NEW.log_date - INTERVAL '3 days' THEN
    UPDATE streaks SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_completed_date = NEW.log_date,
      last_grace_date = NEW.log_date - INTERVAL '1 day',
      total_completions = total_completions + 1,
      grace_days_used = grace_days_used + 1,
      updated_at = NOW()
    WHERE habit_id = NEW.habit_id;
  ELSE
    UPDATE streaks SET
      current_streak = 1,
      last_completed_date = NEW.log_date,
      total_completions = total_completions + 1,
      grace_days_used = 0,
      updated_at = NOW()
    WHERE habit_id = NEW.habit_id;
  END IF;

  -- Award XP and update level
  UPDATE profiles SET
    xp = xp + v_xp_reward,
    total_habits_completed = total_habits_completed + 1,
    level = LEAST(100, 1 + FLOOR(SQRT((xp + v_xp_reward)::FLOAT / 100))::INTEGER),
    last_active_at = NOW()
  WHERE id = NEW.user_id;

  -- Update streak_at_log
  UPDATE habit_logs SET
    streak_at_log = COALESCE((SELECT current_streak FROM streaks WHERE habit_id = NEW.habit_id), 1)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER after_habit_log_insert
  AFTER INSERT ON habit_logs
  FOR EACH ROW EXECUTE PROCEDURE recalculate_streak();

-- ============================================================
-- PARTIES
-- ============================================================
CREATE TABLE parties (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 50),
  description     TEXT DEFAULT '' CHECK (length(description) <= 300),
  invite_code     TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8)),
  owner_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  max_members     INTEGER NOT NULL DEFAULT 10 CHECK (max_members >= 2 AND max_members <= 50),
  is_public       BOOLEAN NOT NULL DEFAULT false,
  challenge_name  TEXT,
  challenge_description TEXT,
  challenge_start_date DATE,
  challenge_end_date DATE,
  icon            TEXT NOT NULL DEFAULT '🏰',
  color           TEXT NOT NULL DEFAULT '#6C5CE7',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX parties_invite_code_idx ON parties(invite_code);

-- ============================================================
-- PARTY MEMBERS
-- ============================================================
CREATE TABLE party_members (
  party_id        UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            party_role NOT NULL DEFAULT 'member',
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (party_id, user_id)
);

CREATE INDEX party_members_user_idx ON party_members(user_id);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id        UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 1000),
  message_type    TEXT NOT NULL DEFAULT 'text',
  metadata        JSONB DEFAULT '{}',
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_party_id_idx ON messages(party_id, created_at DESC);

-- ============================================================
-- REACTIONS
-- ============================================================
CREATE TABLE reactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji           TEXT NOT NULL CHECK (length(emoji) <= 8),
  target_type     TEXT NOT NULL,
  habit_log_id    UUID REFERENCES habit_logs(id) ON DELETE CASCADE,
  message_id      UUID REFERENCES messages(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, emoji, habit_log_id),
  UNIQUE(user_id, emoji, message_id)
);

-- ============================================================
-- FRIENDSHIPS
-- ============================================================
CREATE TABLE friendships (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE achievements (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon            TEXT NOT NULL DEFAULT '🏆',
  category        achievement_category NOT NULL DEFAULT 'completion',
  xp_reward       INTEGER NOT NULL DEFAULT 100,
  criteria        JSONB NOT NULL DEFAULT '{}',
  is_secret       BOOLEAN NOT NULL DEFAULT false,
  is_seasonal     BOOLEAN NOT NULL DEFAULT false,
  season_id       TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_achievements (
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id  TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress        INTEGER NOT NULL DEFAULT 100,
  PRIMARY KEY (user_id, achievement_id)
);

-- ============================================================
-- QUESTS
-- ============================================================
CREATE TABLE quests (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  type            quest_type NOT NULL DEFAULT 'daily',
  xp_reward       INTEGER NOT NULL DEFAULT 75,
  criteria        JSONB NOT NULL DEFAULT '{}',
  icon            TEXT NOT NULL DEFAULT '📜',
  day_of_week     INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  season_id       TEXT,
  active_from     DATE,
  active_until    DATE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_quests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id        TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  assigned_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  progress        INTEGER NOT NULL DEFAULT 0,
  target          INTEGER NOT NULL DEFAULT 1,
  completed_at    TIMESTAMPTZ,
  xp_claimed      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, quest_id, assigned_date)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL DEFAULT '',
  metadata        JSONB DEFAULT '{}',
  is_read         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MAP PROGRESS
-- ============================================================
CREATE TABLE map_progress (
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  biome_id        TEXT NOT NULL,
  progress_pct    INTEGER NOT NULL DEFAULT 0,
  habits_completed INTEGER NOT NULL DEFAULT 0,
  is_unlocked     BOOLEAN NOT NULL DEFAULT false,
  is_completed    BOOLEAN NOT NULL DEFAULT false,
  unlocked_at     TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  PRIMARY KEY (user_id, biome_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetic_items ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT
  USING (public_profile = true OR auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- HABITS
CREATE POLICY "Own habits" ON habits USING (auth.uid() = user_id);

-- HABIT LOGS
CREATE POLICY "Own habit logs" ON habit_logs USING (auth.uid() = user_id);

-- STREAKS
CREATE POLICY "Own streaks" ON streaks USING (auth.uid() = user_id);

-- PARTIES
CREATE POLICY "Party members read parties" ON parties FOR SELECT
  USING (is_public = true OR owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM party_members pm WHERE pm.party_id = id AND pm.user_id = auth.uid()
  ));
CREATE POLICY "Authenticated create party" ON parties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Party owner update" ON parties FOR UPDATE
  USING (auth.uid() = owner_id);
CREATE POLICY "Party owner delete" ON parties FOR DELETE
  USING (auth.uid() = owner_id);

-- PARTY MEMBERS
CREATE POLICY "Party member read" ON party_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM party_members pm WHERE pm.party_id = party_id AND pm.user_id = auth.uid()));
CREATE POLICY "Self insert party member" ON party_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Self delete party member" ON party_members FOR DELETE
  USING (auth.uid() = user_id);

-- MESSAGES
CREATE POLICY "Party message read" ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM party_members pm WHERE pm.party_id = party_id AND pm.user_id = auth.uid()));
CREATE POLICY "Party message insert" ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM party_members pm WHERE pm.party_id = party_id AND pm.user_id = auth.uid()
  ));

-- REACTIONS
CREATE POLICY "Reactions insert own" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reactions read" ON reactions FOR SELECT USING (true);
CREATE POLICY "Own reactions delete" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- ACHIEVEMENTS (catalog public, ownership private)
CREATE POLICY "Achievements public read" ON achievements FOR SELECT USING (true);
CREATE POLICY "User achievements read" ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "User achievements insert" ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- QUESTS
CREATE POLICY "Quests public read" ON quests FOR SELECT USING (true);
CREATE POLICY "Own quests" ON user_quests USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "Own notifications" ON notifications USING (auth.uid() = user_id);

-- MAP PROGRESS
CREATE POLICY "Own map progress" ON map_progress USING (auth.uid() = user_id);

-- USER COSMETICS
CREATE POLICY "Own cosmetics" ON user_cosmetics USING (auth.uid() = user_id);

-- COSMETIC ITEMS (public catalog)
CREATE POLICY "Cosmetics public read" ON cosmetic_items FOR SELECT USING (true);

-- FRIENDSHIPS
CREATE POLICY "Own friendships" ON friendships
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Insert friendship" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE party_members;
ALTER PUBLICATION supabase_realtime ADD TABLE habit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================
-- SEED DATA: Achievements
-- ============================================================
INSERT INTO achievements (id, name, description, icon, category, xp_reward, criteria, sort_order) VALUES
  ('first_habit',      'First Step',           'Complete your first habit',                  '👣', 'completion', 50,   '{"type":"total_completions","threshold":1}',  1),
  ('streak_3',         'On a Roll',            'Maintain a 3-day streak',                   '🔥', 'streak',     75,   '{"type":"streak","threshold":3}',             2),
  ('streak_7',         'Week Warrior',         'Maintain a 7-day streak',                   '⚡', 'streak',     150,  '{"type":"streak","threshold":7}',             3),
  ('streak_30',        'Monthly Legend',       'Maintain a 30-day streak',                  '💎', 'streak',     500,  '{"type":"streak","threshold":30}',            4),
  ('streak_100',       'Centurion',            'Maintain a 100-day streak',                 '👑', 'streak',     2000, '{"type":"streak","threshold":100}',           5),
  ('level_5',          'Rising Hero',          'Reach Level 5',                             '🌟', 'level',      100,  '{"type":"level","threshold":5}',              6),
  ('level_10',         'Seasoned Adventurer',  'Reach Level 10',                            '🏅', 'level',      200,  '{"type":"level","threshold":10}',             7),
  ('level_25',         'Veteran',              'Reach Level 25',                            '🥇', 'level',      500,  '{"type":"level","threshold":25}',             8),
  ('party_joiner',     'Team Player',          'Join your first accountability party',      '🤝', 'social',     100,  '{"type":"party_join","threshold":1}',          9),
  ('invite_friend',    'Recruiter',            'Invite a friend to join',                   '📨', 'social',     75,   '{"type":"invite","threshold":1}',             10),
  ('habit_variety',    'Explorer',             'Create habits in 5 different categories',   '🗺', 'exploration',200,  '{"type":"categories","threshold":5}',          11),
  ('completions_50',   'Half Century',         'Complete habits 50 times total',            '🌈', 'completion', 200,  '{"type":"total_completions","threshold":50}',  12),
  ('completions_500',  'Iron Will',            'Complete habits 500 times total',           '⚔', 'completion', 1000, '{"type":"total_completions","threshold":500}', 13),
  ('forest_complete',  'Nature''s Keeper',     'Complete the Forest biome',                '🌲', 'exploration',300,  '{"type":"biome_complete","biome":"forest"}',   14),
  ('desert_complete',  'Sand Wanderer',        'Complete the Desert biome',                '🌵', 'exploration',300,  '{"type":"biome_complete","biome":"desert"}',   15),
  ('cyber_complete',   'Digital Native',       'Complete the Cyber City biome',            '🤖', 'exploration',300,  '{"type":"biome_complete","biome":"cyber"}',    16),
  ('all_biomes',       'World Traveler',       'Complete all 5 biomes',                    '🌍', 'exploration',2000, '{"type":"all_biomes"}',                        17),
  ('mood_tracker',     'Self Aware',           'Track mood 30 times',                      '🧠', 'completion', 150,  '{"type":"mood_logs","threshold":30}',          18),
  ('night_owl',        'Night Owl',            'Complete a habit after midnight',           '🦉', 'special',    100,  '{"type":"time_of_day","hour_after":0}',        19),
  ('early_bird',       'Early Bird',           'Complete a habit before 7am',              '🐦', 'special',    100,  '{"type":"time_of_day","hour_before":7}',       20);

-- ============================================================
-- SEED DATA: Quests
-- ============================================================
INSERT INTO quests (id, name, description, type, xp_reward, criteria, icon) VALUES
  ('daily_complete_3',  'Triple Threat',      'Complete 3 habits today',         'daily',  75,  '{"type":"daily_completions","target":3}',    '📜'),
  ('daily_complete_all','Perfect Day',        'Complete all your habits today',  'daily',  150, '{"type":"daily_all_complete"}',              '✨'),
  ('daily_mood_log',    'Check In',           'Log your mood on a habit today',  'daily',  50,  '{"type":"mood_log","target":1}',             '😊'),
  ('daily_react',       'Social Butterfly',   'React to a party member''s log',  'daily',  50,  '{"type":"reaction_given","target":1}',       '🦋'),
  ('weekly_streak_5',   'Consistency King',   'Maintain any streak for 5 days',  'weekly', 200, '{"type":"streak_days","target":5}',          '🔥'),
  ('weekly_new_habit',  'Habit Builder',      'Create a new habit this week',    'weekly', 100, '{"type":"create_habit","target":1}',         '🔨'),
  ('weekly_party_chat', 'Chatterbox',         'Send 10 messages in a party',     'weekly', 150, '{"type":"messages_sent","target":10}',       '💬'),
  ('weekly_complete_20','Powerhouse',         'Complete 20 habits this week',    'weekly', 300, '{"type":"weekly_completions","target":20}',  '💪');

-- ============================================================
-- SEED DATA: Cosmetic Items
-- ============================================================
INSERT INTO cosmetic_items (id, name, description, type, sprite_key, rarity, xp_cost) VALUES
  ('hat-crown',    'Pixel Crown',     'For the reigning habit champion',        'hat',        'hat_crown',    'legendary', NULL),
  ('hat-wizard',   'Wizard Hat',      'Cast spells of productivity',            'hat',        'hat_wizard',   'rare',      500),
  ('hat-pirate',   'Pirate Cap',      'Sail the seas of self-improvement',      'hat',        'hat_pirate',   'common',    200),
  ('hat-santa',    'Santa Hat',       'A seasonal classic',                     'hat',        'hat_santa',    'rare',      NULL),
  ('cape-fire',    'Fire Cape',       'Blaze through your habits',              'cape',       'cape_fire',    'epic',      1000),
  ('cape-ice',     'Frost Mantle',    'Cool, calm, consistent',                 'cape',       'cape_ice',     'epic',      1000),
  ('cape-rainbow', 'Rainbow Trail',   'Leave a colorful mark on every habit',   'cape',       'cape_rainbow', 'legendary', NULL),
  ('pet-slime',    'Green Slime',     'A bouncy companion for your journey',    'pet',        'pet_slime',    'common',    150),
  ('pet-dragon',   'Baby Dragon',     'The mightiest of habit companions',      'pet',        'pet_dragon',   'legendary', NULL),
  ('pet-cat',      'Pixel Cat',       'A purrfect productivity partner',        'pet',        'pet_cat',      'rare',      400),
  ('bg-forest',    'Forest Clearing', 'A peaceful woodland background',         'background', 'bg_forest',    'common',    0),
  ('bg-cyber',     'Neon Grid',       'Future vibes background',                'background', 'bg_cyber',     'rare',      600),
  ('frame-gold',   'Gold Frame',      'Premium avatar border',                  'frame',      'frame_gold',   'epic',      800);
