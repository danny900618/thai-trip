import { useEffect, useState } from 'react'
import { TRIP } from '../config'

export const TH_TZ = 'Asia/Bangkok'

/**
 * 模擬時間：網址加 ?now=2027-01-19T10:00 即可測試旅途中的畫面（視為泰國時間）
 * 模擬時間會繼續往前走。
 */
const offsetMs = (() => {
  const p = new URLSearchParams(location.search).get('now')
  if (!p) return 0
  const hasTz = /([+-]\d\d:?\d\d|Z)$/.test(p)
  const d = new Date(hasTz ? p : `${p.length === 10 ? p + 'T09:00' : p}+07:00`)
  return isNaN(+d) ? 0 : +d - Date.now()
})()

export const isSimulated = offsetMs !== 0
export const now = () => new Date(Date.now() + offsetMs)

export function useNow(intervalMs = 1000) {
  const [t, setT] = useState(now)
  useEffect(() => {
    const id = setInterval(() => setT(now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return t
}

const dateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TH_TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
/** 泰國當地日期 YYYY-MM-DD */
export const thDateKey = (d: Date) => dateFmt.format(d)

const timeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TH_TZ, hour: '2-digit', minute: '2-digit', hour12: false })
export const thTime = (d: Date) => timeFmt.format(d)

/** 時間字串 -> HH:MM。接受 9:30、09:30:00、上午 9:30:00、9:30 PM */
export function normTime(s: string): string {
  s = (s || '').trim()
  if (!s) return ''
  const m = s.match(/(\d{1,2})[:：](\d{2})/)
  if (!m) return ''
  let h = +m[1]
  const pm = /下午|晚上|PM/i.test(s)
  const am = /上午|早上|AM/i.test(s)
  if (pm && h < 12) h += 12
  if (am && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m[2]}`
}

/** 日期字串 -> YYYY-MM-DD。接受 2027/1/18、2027-01-18、1/18（預設 2027 年） */
export function normDate(s: string): string {
  s = (s || '').trim()
  let m = s.match(/(\d{4})[/\-.年](\d{1,2})[/\-.月](\d{1,2})/)
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
  m = s.match(/^(\d{1,2})[/\-.月](\d{1,2})/)
  if (m) return `${TRIP.startDate.slice(0, 4)}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`
  return ''
}

export const addDays = (key: string, n: number) => {
  const d = new Date(`${key}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const diffDays = (a: string, b: string) =>
  Math.round((+new Date(`${b}T00:00:00Z`) - +new Date(`${a}T00:00:00Z`)) / 86400000)

export const tripDays = (): string[] => {
  const n = diffDays(TRIP.startDate, TRIP.endDate)
  return Array.from({ length: n + 1 }, (_, i) => addDays(TRIP.startDate, i))
}

const WEEK = ['日', '一', '二', '三', '四', '五', '六']
export const prettyDate = (key: string) => {
  const d = new Date(`${key}T00:00:00Z`)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${WEEK[d.getUTCDay()]}）`
}

export const fmtDuration = (ms: number) => {
  const min = Math.max(0, Math.round(ms / 60000))
  if (min < 60) return `${min} 分鐘`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} 小時 ${m} 分` : `${h} 小時`
}
