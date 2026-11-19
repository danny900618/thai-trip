import { useEffect, useState } from 'react'
import { WEATHER_PLACES, type WeatherPlace } from '../config'

export type DayWeather = {
  date: string
  code: number
  max: number
  min: number
  rain: number // 降雨機率 %
  uv: number
}

/** WMO weather code -> 圖示＋中文 */
export function describe(code: number): { icon: string; text: string } {
  if (code === 0) return { icon: '☀️', text: '晴' }
  if (code <= 2) return { icon: '🌤️', text: '晴時多雲' }
  if (code === 3) return { icon: '☁️', text: '陰' }
  if (code <= 48) return { icon: '🌫️', text: '霧' }
  if (code <= 57) return { icon: '🌦️', text: '毛毛雨' }
  if (code <= 67) return { icon: '🌧️', text: '雨' }
  if (code <= 77) return { icon: '🌨️', text: '雪' }
  if (code <= 82) return { icon: '🌦️', text: '陣雨' }
  return { icon: '⛈️', text: '雷雨' }
}

export const placeFor = (date: string): WeatherPlace =>
  [...WEATHER_PLACES].reverse().find((p) => date >= p.from) ?? WEATHER_PLACES[0]

const TTL = 60 * 60 * 1000

export function useWeather(place: WeatherPlace) {
  const key = `wx:${place.lat},${place.lon}`
  const [data, setData] = useState<{ days: DayWeather[]; at: number } | null>(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState(false)

  useEffect(() => {
    if (data && Date.now() - data.at < TTL) return
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
      `&timezone=Asia%2FBangkok&forecast_days=16`
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        const d = j.daily
        const days: DayWeather[] = d.time.map((t: string, i: number) => ({
          date: t,
          code: d.weather_code[i],
          max: Math.round(d.temperature_2m_max[i]),
          min: Math.round(d.temperature_2m_min[i]),
          rain: d.precipitation_probability_max[i] ?? 0,
          uv: Math.round(d.uv_index_max[i] ?? 0),
        }))
        const v = { days, at: Date.now() }
        setData(v)
        try {
          localStorage.setItem(key, JSON.stringify(v))
        } catch { /* ignore */ }
      })
      .catch(() => setError(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { days: data?.days ?? [], at: data?.at ?? null, error }
}
