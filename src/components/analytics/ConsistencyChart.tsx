'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

const MOCK_DATA = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  fitness: Math.floor(60 + Math.random() * 40),
  learning: Math.floor(50 + Math.random() * 50),
  mindfulness: Math.floor(40 + Math.random() * 60),
}))

const COLORS = {
  fitness: '#39ff14',
  learning: '#00d4ff',
  mindfulness: '#bf5fff',
}

export function ConsistencyChart() {
  return (
    <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="font-semibold text-white mb-4">Consistency Over Time</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={MOCK_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: '#13131f', border: '1px solid #2a2a4a', borderRadius: 6 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`${value}%`]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {Object.entries(COLORS).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
