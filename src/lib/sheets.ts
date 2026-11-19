import Papa from 'papaparse'
import { useCallback, useEffect, useState } from 'react'
import { SHEETS } from '../config'
import { SAMPLE_ITINERARY, SAMPLE_MEMBERS } from '../data/sample'
import { normDate, normTime } from './time'

export type ItemType = '交通' | '景點' | '餐廳' | '購物' | '住宿' | '自由' | '其他'

export type Item = {
  date: string // YYYY-MM-DD
  start: string // HH:MM
  end: string
  title: string
  type: ItemType
  place: string
  map: string
  link: string
  note: string
  tw: boolean // 時間為台灣時間
  startAt: number // epoch ms
  endAt: number
}

export type Member = {
  code: string
  name: string
  room: string
  roommate: string
  tdac: string
  note: string
  flightOut: string // 自行搭機者的去程（留空 = 團體班機）
  flightBack: string
}

export const TYPE_ICON: Record<ItemType, string> = {
  交通: '🚐', 景點: '📸', 餐廳: '🍜', 購物: '🛍️', 住宿: '🏨', 自由: '🌴', 其他: '📌',
}

const TYPES = Object.keys(TYPE_ICON) as ItemType[]

const v = (r: Record<string, string>, k: string) => (r[k] ?? '').toString().trim()

function toItems(rows: Record<string, string>[]): Item[] {
  const items = rows
    .map((r) => {
      const date = normDate(v(r, '日期'))
      const start = normTime(v(r, '開始'))
      const title = v(r, '標題')
      if (!date || !title) return null
      const tw = v(r, '時區').includes('台')
      const tz = tw ? '+08:00' : '+07:00'
      const end = normTime(v(r, '結束'))
      const startAt = +new Date(`${date}T${start || '00:00'}:00${tz}`)
      const t = v(r, '類型') as ItemType
      return {
        date, start, end, title,
        type: TYPES.includes(t) ? t : '其他',
        place: v(r, '地點'),
        map: v(r, '地圖'),
        link: v(r, '連結'),
        note: v(r, '備註'),
        tw, startAt,
        endAt: end ? +new Date(`${date}T${end}:00${tz}`) : 0,
      } as Item
    })
    .filter((x): x is Item => !!x)
    .sort((a, b) => a.startAt - b.startAt)

  // 沒填結束時間：預設 1 小時，但不超過下一個行程的開始時間
  items.forEach((it, i) => {
    if (it.endAt > it.startAt) return
    const next = items[i + 1]
    it.endAt = Math.min(it.startAt + 3600_000, next ? next.startAt : Infinity)
  })
  return items
}

function toMembers(rows: Record<string, string>[]): Member[] {
  return rows
    .map((r) => ({
      code: v(r, '代碼'), name: v(r, '姓名'), room: v(r, '房間') || v(r, '房號'),
      roommate: v(r, '同房'), tdac: v(r, '入境卡'), note: v(r, '備註'),
      flightOut: v(r, '去程'), flightBack: v(r, '回程'),
    }))
    .filter((m) => m.code && m.name)
}

type Cached = { rows: Record<string, string>[]; at: number }

const cacheKey = (k: string) => `sheet:${k}`
function readCache(k: string): Cached | null {
  try {
    const s = localStorage.getItem(cacheKey(k))
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}
function writeCache(k: string, c: Cached) {
  try {
    localStorage.setItem(cacheKey(k), JSON.stringify(c))
  } catch { /* 無痕模式等情況忽略 */ }
}

async function fetchCsv(url: string): Promise<Record<string, string>[]> {
  // 加時間參數避免拿到舊快取
  const res = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now())
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  const out = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() })
  return out.data
}

export type TripData = {
  items: Item[]
  members: Member[]
  updatedAt: number | null
  status: 'sample' | 'loading' | 'ok' | 'offline'
  refresh: () => void
}

export function useTripData(): TripData {
  const usingSheet = !!(SHEETS.itinerary || SHEETS.members)
  const [state, setState] = useState(() => {
    const ci = readCache('itinerary')
    const cm = readCache('members')
    return {
      itRows: SHEETS.itinerary ? ci?.rows ?? [] : SAMPLE_ITINERARY,
      memRows: SHEETS.members ? cm?.rows ?? [] : SAMPLE_MEMBERS,
      updatedAt: ci?.at ?? cm?.at ?? null,
      status: (usingSheet ? 'loading' : 'sample') as TripData['status'],
    }
  })

  const load = useCallback(async () => {
    if (!usingSheet) return
    setState((s) => ({ ...s, status: 'loading' }))
    const at = Date.now()
    const [it, mem] = await Promise.allSettled([
      SHEETS.itinerary ? fetchCsv(SHEETS.itinerary) : Promise.resolve(SAMPLE_ITINERARY),
      SHEETS.members ? fetchCsv(SHEETS.members) : Promise.resolve(SAMPLE_MEMBERS),
    ])
    setState((s) => {
      const next = { ...s }
      let ok = true
      if (it.status === 'fulfilled') {
        next.itRows = it.value
        if (SHEETS.itinerary) writeCache('itinerary', { rows: it.value, at })
      } else ok = false
      if (mem.status === 'fulfilled') {
        next.memRows = mem.value
        if (SHEETS.members) writeCache('members', { rows: mem.value, at })
      } else ok = false
      next.status = ok ? 'ok' : 'offline'
      if (ok) next.updatedAt = at
      return next
    })
  }, [usingSheet])

  useEffect(() => {
    load()
    const onVis = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [load])

  return {
    items: toItems(state.itRows),
    members: toMembers(state.memRows),
    updatedAt: state.updatedAt,
    status: state.status,
    refresh: load,
  }
}

/** 個人代碼：網址 ?me=xxx 會記住在這支手機 */
/** 目前選擇的成員（在「我的」頁點名字選擇，記在這支手機） */
export function getMyCode(): string {
  try {
    return localStorage.getItem('me') || ''
  } catch {
    return ''
  }
}

export function saveMyCode(code: string) {
  try {
    if (code) localStorage.setItem('me', code)
    else localStorage.removeItem('me')
  } catch { /* 無痕模式等情況忽略 */ }
}
