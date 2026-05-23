'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { HABIT_CATEGORIES } from '@/lib/constants/habits'

const MOCK_DATA = [
  { name: 'Fitness',     value: 35 },
  { name: 'Learning',    value: 25 },
  { name: 'Mindfulness', value: 20 },
  { name: 'Nutrition',   value: 12 },
  { name: 'Other',       value: 8 },
]

const COLORS = ['#39ff14', '#00d4ff', '#bf5fff', '#ffe000', '#ff7c2a']

export function CategoryBreakdown() {
  return (
    <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="font-semibold text-white mb-4">By Category</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie data={MOCK_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
              {MOCK_DATA.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#13131f', border: '1px solid #2a2a4a', borderRadius: 6 }}
              formatter={(v: number) => [`${v}%`]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1.5">
          {MOCK_DATA.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <span className="text-slate-400">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
