import { FLIGHTS, TRIP } from '../config'
import { Card, DriverButton, HotelInfo, hotelFor, ItemRow, usePacking, WeatherBig, WeatherDay } from '../components'
import type { Item, Member } from '../lib/sheets'
import { addDays, diffDays, fmtDuration, prettyDate, thDateKey, thTime, tripDays, useNow } from '../lib/time'
import { placeFor, useWeather } from '../lib/weather'
import type { Tab } from '../App'

type Props = { items: Item[]; me?: Member; go: (t: Tab) => void }

export default function Today({ items, me, go }: Props) {
  const t = useNow(1000)
  const departAt = +new Date(TRIP.departure)
  const lastFlight = FLIGHTS[FLIGHTS.length - 1]
  const endAt = lastFlight ? +new Date(lastFlight.arrive) : +new Date(`${TRIP.endDate}T23:59:59+07:00`)

  if (+t < departAt) return <Before t={t} items={items} me={me} go={go} />
  if (+t <= endAt) return <During t={t} items={items} me={me} />
  return <After go={go} />
}

/* ────────────── 出發前 ────────────── */

function Before({ t, items, me, go }: { t: Date } & Props) {
  const ms = +new Date(TRIP.departure) - +t
  const days = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const pack = usePacking()
  const day1 = items.filter((i) => i.date === TRIP.startDate)
  const place = placeFor(TRIP.startDate)
  const wx = useWeather(place)
  const tripWx = wx.days.filter((d) => d.date >= TRIP.startDate && d.date <= TRIP.endDate)
  const daysToTrip = diffDays(thDateKey(t), TRIP.startDate)
  const out = FLIGHTS[0]

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">{TRIP.emoji} {TRIP.title}・{TRIP.members} 人</p>
        {days >= 2 ? (
          <>
            <p className="hero-big"><span>{days}</span> 天</p>
            <p className="hero-sub">還有 {h} 小時 {m} 分，就要出發了！</p>
          </>
        ) : (
          <>
            <p className="hero-clock">
              {String(days * 24 + h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </p>
            <p className="hero-sub">{days * 24 + h < 12 ? '快出發了！護照帶了嗎？🛂' : '明天就出發了！今晚早點睡 😴'}</p>
          </>
        )}
        <p className="hero-meta">
          {prettyDate(TRIP.startDate)} {new Date(TRIP.departure).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false })} {TRIP.departureLabel}
          {out && `・${out.code}`}
        </p>
      </section>

      <Card title="✅ 出發前準備">
        <button className="todo" onClick={() => go('info')}>
          <span>🧳 行李清單</span>
          <span className="todo-progress">
            <span className="bar"><i style={{ width: `${(pack.count / pack.total) * 100}%` }} /></span>
            {pack.count}/{pack.total}
          </span>
        </button>
        <button className="todo" onClick={() => go('me')}>
          <span>🛂 入境卡 TDAC</span>
          <span className="muted">{me ? (me.tdac ? '已完成，點此查看 ›' : '代辦中…') : '選擇你的名字 ›'}</span>
        </button>
        {daysToTrip <= 7 && (
          <p className="tip">出發前一週：確認護照效期、換好泰銖、辦好網路（eSIM／漫遊）。</p>
        )}
      </Card>

      <Card title={`🌤️ ${place.name}天氣`}>
        {tripWx.length ? (
          <>
            <div className="wx-strip">{tripWx.map((d) => <WeatherDay key={d.date} d={d} />)}</div>
            {tripWx.length < tripDays().length && <p className="muted small">其餘日期之後會陸續出現</p>}
          </>
        ) : (
          <>
            <p>{place.climate}</p>
            <p className="muted small">出發前約 2 週開始會顯示每日天氣預報。</p>
          </>
        )}
      </Card>

      {day1.length > 0 && (
        <Card title="📅 第一天行程" right={<button className="link" onClick={() => go('schedule')}>全部行程 ›</button>}>
          <ul className="timeline">{day1.map((i, k) => <ItemRow key={k} item={i} />)}</ul>
        </Card>
      )}
    </>
  )
}

/* ────────────── 旅途中 ────────────── */

function During({ t, items, me }: { t: Date; items: Item[]; me?: Member }) {
  const today = thDateKey(t)
  const days = tripDays()
  const dayNo = Math.min(Math.max(days.indexOf(today), 0), days.length - 1) + 1
  const todays = items.filter((i) => i.date === today)
  const nowItem = todays.find((i) => +t >= i.startAt && +t < i.endAt)
  const nextItem = items.find((i) => i.startAt > +t)
  const tomorrow = items.filter((i) => i.date === addDays(today, 1))
  const place = placeFor(today)
  const wx = useWeather(place)
  const wxToday = wx.days.find((d) => d.date === today)
  const wxTomorrow = wx.days.find((d) => d.date === addDays(today, 1))
  const hotel = hotelFor(today)
  const isArrivalDay = today === TRIP.startDate

  const state = (i: Item) =>
    i === nowItem ? 'now' : i === nextItem ? 'next' : i.endAt <= +t ? 'past' : undefined

  return (
    <>
      <section className="hero hero-during">
        <p className="hero-kicker">Day {dayNo} / {days.length}・{prettyDate(today)}</p>
        <p className="hero-clock small">泰國 {thTime(t)}</p>
        <p className="hero-sub muted-on-hero">台灣 {new Date(t).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false })}（快 1 小時）</p>
      </section>

      {isArrivalDay && me?.tdac && (
        <Card title="🛂 準備入境" tone="warn">
          <p>過海關時請準備好<strong>護照</strong>與<strong>入境卡 QR code</strong>。</p>
          <a className="btn btn-primary btn-block" href={me.tdac} target="_blank" rel="noreferrer">出示我的入境卡</a>
        </Card>
      )}

      {nowItem && (
        <Card title="⏱️ 現在" tone="accent">
          <ul className="timeline"><ItemRow item={nowItem} state="now" /></ul>
          <Progress from={nowItem.startAt} to={nowItem.endAt} t={+t} />
        </Card>
      )}

      {nextItem && (
        <Card title="⏭️ 接下來" right={<span className="pill pill-next">{fmtDuration(nextItem.startAt - +t)}後</span>}>
          <ul className="timeline"><ItemRow item={nextItem} /></ul>
          {nextItem.date !== today && <p className="muted small">{prettyDate(nextItem.date)}</p>}
        </Card>
      )}

      {!nowItem && !nextItem && <Card><p>今天的行程都結束了，好好休息 🌙</p></Card>}

      {wxToday && (
        <Card title="🌤️ 今日天氣">
          <WeatherBig d={wxToday} place={place.name} />
          {wxTomorrow && <p className="muted small">明天：{wxTomorrow.max}° / {wxTomorrow.min}°，降雨 {wxTomorrow.rain}%</p>}
        </Card>
      )}

      <Card title="📅 今日行程">
        {todays.length ? (
          <ul className="timeline">{todays.map((i, k) => <ItemRow key={k} item={i} state={state(i)} />)}</ul>
        ) : (
          <p className="muted">今天沒有排定行程（自由活動）</p>
        )}
      </Card>

      {tomorrow.length > 0 && (
        <Card title="🌅 明天第一個行程">
          <ul className="timeline"><ItemRow item={tomorrow[0]} /></ul>
        </Card>
      )}

      {hotel && (
        <Card title="🏨 今晚住宿">
          <p><strong>{hotel.name}</strong></p>
          <DriverButton hotel={hotel} />
          <HotelInfo hotel={hotel} />
        </Card>
      )}
    </>
  )
}

function Progress({ from, to, t }: { from: number; to: number; t: number }) {
  const p = Math.min(100, Math.max(0, ((t - from) / (to - from)) * 100))
  return (
    <div className="progress">
      <span className="bar"><i style={{ width: `${p}%` }} /></span>
      <span className="muted small">剩 {fmtDuration(to - t)}</span>
    </div>
  )
}

/* ────────────── 回國後 ────────────── */

function After({ go }: { go: (t: Tab) => void }) {
  return (
    <section className="hero">
      <p className="hero-kicker">{TRIP.emoji} {TRIP.title}</p>
      <p className="hero-big small">旅程結束，平安回家 🏠</p>
      <p className="hero-sub">謝謝大家這幾天的陪伴！記得把照片分享出來 📸</p>
      <button className="btn btn-light" onClick={() => go('schedule')}>回顧行程</button>
    </section>
  )
}
