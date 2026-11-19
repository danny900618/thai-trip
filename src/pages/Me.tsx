import { FLIGHTS } from '../config'
import { Card } from '../components'
import type { Member, TripData } from '../lib/sheets'

const fmt = (iso: string, tz: string) =>
  new Date(iso).toLocaleString('zh-TW', { timeZone: tz, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
const tzOf = (iso: string) => (iso.endsWith('+08:00') ? 'Asia/Taipei' : 'Asia/Bangkok')

export default function Me({ me, code, data }: { me?: Member; code: string; data: TripData }) {
  if (!code) {
    return (
      <Card title="👤 我的資料">
        <p>請使用總召傳給你的<strong>個人專屬連結</strong>開啟，這支手機之後就會記住你。</p>
      </Card>
    )
  }
  if (!me) {
    return (
      <Card title="👤 我的資料">
        <p>{data.status === 'loading' ? '載入中…' : '找不到你的資料，請確認連結是否正確，或聯絡總召。'}</p>
      </Card>
    )
  }

  return (
    <>
      <section className="hero hero-me">
        <p className="hero-kicker">嗨 👋</p>
        <p className="hero-big small">{me.name}</p>
      </section>

      <Card title="🛂 泰國入境卡 TDAC" tone="accent">
        {me.tdac ? (
          <>
            <p>過海關時，移民官可能會要求出示 QR code，請和護照一起準備好。</p>
            <a className="btn btn-primary btn-block btn-big" href={me.tdac} target="_blank" rel="noreferrer">出示我的入境卡</a>
            <p className="muted small">💡 建議現在先打開一次並<strong>截圖存到相簿</strong>，飛機上和剛落地時可能沒有網路。</p>
          </>
        ) : (
          <p>總召代辦中，完成後這裡會出現按鈕。</p>
        )}
      </Card>

      {(me.room || me.roommate) && (
        <Card title="🏨 住宿">
          <dl className="kv">
            {me.room && <><dt>房間</dt><dd>{me.room}</dd></>}
            {me.roommate && <><dt>同房</dt><dd>{me.roommate}</dd></>}
          </dl>
        </Card>
      )}

      <Card title="✈️ 班機">
        {FLIGHTS.map((f) => (
          <div key={f.code} className="flight">
            <div className="flight-head"><span className="pill">{f.label}</span><b>{f.code}</b>{f.terminal && <span className="muted small">{f.terminal}</span>}</div>
            <div className="flight-route">
              <div><small>{f.from}</small><b>{fmt(f.depart, tzOf(f.depart))}</b></div>
              <span>→</span>
              <div><small>{f.to}</small><b>{fmt(f.arrive, tzOf(f.arrive))}</b></div>
            </div>
            {f.note && <p className="muted small">{f.note}</p>}
          </div>
        ))}
        <p className="muted small">時間皆為當地時間</p>
      </Card>

      {me.note && (
        <Card title="📝 備註">
          <p>{me.note}</p>
        </Card>
      )}
    </>
  )
}
