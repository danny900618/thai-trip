import { Card, usePacking } from '../components'
import { NOTICES, PACKING } from '../data/static'

export default function Info() {
  const pack = usePacking()
  return (
    <>
      <Card title="🧳 必帶清單" right={<span className="muted">{pack.count}/{pack.total}</span>}>
        <p className="muted small">打勾只會記在你自己的手機上。</p>
        <ul className="checklist">
          {PACKING.map((p) => (
            <li key={p.id}>
              <label className={pack.done.includes(p.id) ? 'checked' : ''}>
                <input type="checkbox" checked={pack.done.includes(p.id)} onChange={() => pack.toggle(p.id)} />
                <span>
                  <b>{p.text}</b>
                  {p.detail && <small>{p.detail}</small>}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="⚠️ 注意事項">
        <ul className="notices">
          {NOTICES.map((n) => (
            <li key={n.title} className={n.level ?? ''}>
              <span className="notice-icon">{n.icon}</span>
              <div>
                <b>{n.title}</b>
                <p>{n.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
