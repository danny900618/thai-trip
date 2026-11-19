import { useEffect, useState } from 'react'
import { getMyCode, saveMyCode, useTripData } from './lib/sheets'
import { isSimulated, now } from './lib/time'
import Today from './pages/Today'
import Schedule from './pages/Schedule'
import Info from './pages/Info'
import Emergency from './pages/Emergency'
import Me from './pages/Me'

export type Tab = 'today' | 'schedule' | 'info' | 'sos' | 'me'

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today', icon: '🏠', label: '今天' },
  { id: 'schedule', icon: '📅', label: '行程' },
  { id: 'info', icon: '📋', label: '須知' },
  { id: 'sos', icon: '🆘', label: '緊急' },
  { id: 'me', icon: '👤', label: '我的' },
]

const fromHash = (): Tab => {
  const h = location.hash.replace('#/', '') as Tab
  return TABS.some((t) => t.id === h) ? h : 'today'
}

export default function App() {
  const [tab, setTab] = useState<Tab>(fromHash)
  const data = useTripData()
  const [code, setCode] = useState(getMyCode)
  const me = data.members.find((m) => m.code === code)
  const pick = (c: string) => {
    saveMyCode(c)
    setCode(c)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const onHash = () => setTab(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (t: Tab) => {
    location.hash = `/${t}`
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      {isSimulated && <div className="sim-bar">🧪 模擬時間：{now().toLocaleString('zh-TW', { timeZone: 'Asia/Bangkok', hour12: false })}（泰國）</div>}
      <main className="main">
        {tab === 'today' && <Today items={data.items} me={me} go={go} />}
        {tab === 'schedule' && <Schedule data={data} />}
        {tab === 'info' && <Info />}
        {tab === 'sos' && <Emergency />}
        {tab === 'me' && <Me me={me} data={data} pick={pick} />}
      </main>
      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={`${tab === t.id ? 'on' : ''} ${t.id === 'sos' ? 'sos' : ''}`} onClick={() => go(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
