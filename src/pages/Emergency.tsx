import { HOTELS, LOST_TIPS } from '../config'
import { Card, DriverButton, HotelInfo } from '../components'
import { EMERGENCY_THAI, EMERGENCY_TW, type Phone } from '../data/static'

function PhoneList({ list }: { list: Phone[] }) {
  return (
    <ul className="phones">
      {list.map((p) => (
        <li key={p.name}>
          <a href={`tel:${p.dial}`} className={p.urgent ? 'urgent' : ''}>
            <span>
              <b>{p.name}</b>
              {p.desc && <small>{p.desc}</small>}
            </span>
            <span className="phone-num">📞 {p.display}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Emergency() {
  return (
    <>
      <Card title="🚨 泰國緊急電話" tone="danger">
        <PhoneList list={EMERGENCY_THAI} />
      </Card>

      <Card title="🇹🇼 台灣駐外單位">
        <PhoneList list={EMERGENCY_TW} />
        <p className="muted small">護照遺失：先到警察局報案拿報案證明，再聯絡辦事處補辦入國證明書。</p>
      </Card>

      <Card title="👥 走散了怎麼辦">
        <ol className="steps">{LOST_TIPS.map((t) => <li key={t}>{t}</li>)}</ol>
      </Card>

      {HOTELS.map((h) => (
        <Card key={h.name} title="🏨 住宿">
          <p><strong>{h.name}</strong></p>
          <p className="muted small">{h.checkIn.slice(5).replace('-', '/')} – {h.checkOut.slice(5).replace('-', '/')}</p>
          <p lang="th" className="th-addr">{h.addressTh}</p>
          <div className="btn-row">
            {h.phone && <a className="btn btn-light" href={`tel:${h.phone.replace(/\s/g, '')}`}>☎ 打給住宿</a>}
            {h.mapUrl && <a className="btn btn-light" href={h.mapUrl} target="_blank" rel="noreferrer">🗺️ 地圖</a>}
          </div>
          <DriverButton hotel={h} />
          <HotelInfo hotel={h} />
        </Card>
      ))}

      <Card title="🗣️ 救命用泰文">
        <ul className="phrases">
          <li><b>ช่วยด้วย</b><span>Chûay dûay！救命！</span></li>
          <li><b>ไปโรงพยาบาล</b><span>Pai rohng pha-yaa-baan 去醫院</span></li>
          <li><b>เรียกตำรวจ</b><span>Rîak tam-rùat 叫警察</span></li>
          <li><b>ห้องน้ำอยู่ที่ไหน</b><span>Hông-náam yùu thîi-nǎi？廁所在哪？</span></li>
        </ul>
      </Card>
    </>
  )
}
