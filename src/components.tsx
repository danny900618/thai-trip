import { useState, type ReactNode } from 'react'
import { HOTELS, type Hotel } from './config'
import { TYPE_ICON, type Item } from './lib/sheets'
import { PACKING } from './data/static'
import { prettyDate } from './lib/time'
import { describe, type DayWeather } from './lib/weather'

export function Card({ title, right, children, tone }: { title?: ReactNode; right?: ReactNode; children: ReactNode; tone?: 'accent' | 'warn' | 'danger' }) {
  return (
    <section className={`card ${tone ? 'card-' + tone : ''}`}>
      {(title || right) && (
        <header className="card-head">
          <h2>{title}</h2>
          {right}
        </header>
      )}
      {children}
    </section>
  )
}

export function ItemRow({ item, state }: { item: Item; state?: 'past' | 'now' | 'next' }) {
  return (
    <li className={`item ${state ?? ''}`}>
      <div className="item-time">
        <b>{item.start || '—'}</b>
        {item.end && <span>{item.end}</span>}
        {item.tw && <em>台灣時間</em>}
      </div>
      <div className="item-dot" aria-hidden>{TYPE_ICON[item.type]}</div>
      <div className="item-body">
        <div className="item-title">
          {item.title}
          {state === 'now' && <span className="pill pill-now">進行中</span>}
          {state === 'next' && <span className="pill pill-next">下一個</span>}
        </div>
        {item.place && <div className="item-place">📍 {item.place}</div>}
        {item.note && <div className="item-note">{item.note}</div>}
        {(item.map || item.link) && (
          <div className="item-links">
            {item.map && <a href={item.map} target="_blank" rel="noreferrer">🗺️ 地圖</a>}
            {item.link && <a href={item.link} target="_blank" rel="noreferrer">🔗 相關連結</a>}
          </div>
        )}
      </div>
    </li>
  )
}

export function WeatherDay({ d, label }: { d: DayWeather; label?: string }) {
  const w = describe(d.code)
  return (
    <div className="wx-day">
      <div className="wx-label">{label ?? prettyDate(d.date)}</div>
      <div className="wx-icon">{w.icon}</div>
      <div className="wx-temp"><b>{d.max}°</b> / {d.min}°</div>
      <div className="wx-rain">☔ {d.rain}%</div>
    </div>
  )
}

export function WeatherBig({ d, place }: { d: DayWeather; place: string }) {
  const w = describe(d.code)
  return (
    <div className="wx-big">
      <div className="wx-big-icon">{w.icon}</div>
      <div>
        <div className="wx-big-temp">{d.max}° <small>/ {d.min}°</small></div>
        <div className="muted">{place}・{w.text}・降雨 {d.rain}%</div>
      </div>
      {d.uv >= 8 && <div className="wx-tip">UV {d.uv} 很強，記得防曬補水</div>}
      {d.rain >= 50 && <div className="wx-tip">降雨機率高，帶把傘 ☂️</div>}
    </div>
  )
}

export const hotelFor = (date: string): Hotel | undefined =>
  HOTELS.find((h) => date >= h.checkIn && date < h.checkOut) ?? HOTELS.find((h) => date === h.checkOut) ?? HOTELS[0]

/** 全螢幕泰文地址卡：給計程車司機看 */
export function DriverButton({ hotel, label = '🚕 給司機看住宿地址' }: { hotel: Hotel; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="btn btn-primary btn-block" onClick={() => setOpen(true)}>{label}</button>
      {open && (
        <div className="driver" onClick={() => setOpen(false)} role="dialog">
          <p className="driver-hint">請帶我到這個地址 / Please take me here</p>
          <h1 lang="th">{hotel.nameTh}</h1>
          <p lang="th" className="driver-addr">{hotel.addressTh}</p>
          <p className="driver-en">{hotel.name}<br />{hotel.addressEn}</p>
          {hotel.phone && (
            <a className="driver-phone" href={`tel:${hotel.phone.replace(/\s/g, '')}`} onClick={(e) => e.stopPropagation()}>☎ {hotel.phone}</a>
          )}
          <p className="driver-close">點一下關閉</p>
        </div>
      )}
    </>
  )
}

/** 住宿詳細：入住時間、Wi-Fi、注意事項 */
export function HotelInfo({ hotel }: { hotel: Hotel }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!hotel.wifi) return
    navigator.clipboard?.writeText(hotel.wifi.password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <>
      <dl className="kv">
        {hotel.checkInTime && <><dt>入住</dt><dd>{hotel.checkInTime}</dd></>}
        {hotel.wifi && (
          <>
            <dt>Wi-Fi</dt><dd>{hotel.wifi.ssid}</dd>
            <dt>密碼</dt>
            <dd>
              <code>{hotel.wifi.password}</code>{' '}
              <button className="link" onClick={copy}>{copied ? '已複製 ✓' : '複製'}</button>
            </dd>
          </>
        )}
      </dl>
      {hotel.rules && hotel.rules.length > 0 && (
        <ul className="rules">{hotel.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      )}
    </>
  )
}

const PACK_KEY = 'packing'
export function usePacking() {
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PACK_KEY) || '[]')
    } catch {
      return []
    }
  })
  const toggle = (id: string) =>
    setDone((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      try {
        localStorage.setItem(PACK_KEY, JSON.stringify(next))
      } catch { /* ignore */ }
      return next
    })
  const count = PACKING.filter((p) => done.includes(p.id)).length
  return { done, toggle, count, total: PACKING.length }
}
