import { useState } from 'react'
import { Card, ItemRow } from '../components'
import type { TripData } from '../lib/sheets'
import { now, prettyDate, thDateKey, tripDays } from '../lib/time'

export default function Schedule({ data }: { data: TripData }) {
  const days = tripDays()
  const today = thDateKey(now())
  const [sel, setSel] = useState(days.includes(today) ? today : days[0])
  const list = data.items.filter((i) => i.date === sel)
  const t = +now()

  return (
    <>
      <nav className="day-tabs">
        {days.map((d, i) => (
          <button key={d} className={d === sel ? 'on' : ''} onClick={() => setSel(d)}>
            <small>Day {i + 1}</small>
            {prettyDate(d).replace(/（.）/, '')}
            {d === today && <i className="today-dot" />}
          </button>
        ))}
      </nav>

      <Card title={prettyDate(sel)}>
        {list.length ? (
          <ul className="timeline">
            {list.map((i, k) => (
              <ItemRow key={k} item={i} state={i.endAt <= t ? 'past' : i.startAt <= t ? 'now' : undefined} />
            ))}
          </ul>
        ) : (
          <p className="muted">這天的行程還在安排中…</p>
        )}
      </Card>

      <p className="data-status">
        {data.status === 'sample' && '目前顯示範例資料'}
        {data.status === 'loading' && '更新中…'}
        {data.status === 'ok' && data.updatedAt && `資料更新於 ${new Date(data.updatedAt).toLocaleString('zh-TW', { hour12: false })}`}
        {data.status === 'offline' && `⚠️ 離線中，顯示上次的資料${data.updatedAt ? `（${new Date(data.updatedAt).toLocaleString('zh-TW', { hour12: false })}）` : ''}`}
        {data.status !== 'sample' && <button className="link" onClick={data.refresh}>重新整理</button>}
      </p>
    </>
  )
}
