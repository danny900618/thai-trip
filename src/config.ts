/**
 * ✏️ 旅程設定 —— 大部分要改的東西都在這個檔案
 * 標示「TODO」的地方請換成實際資料
 */

export const TRIP = {
  title: '泰國家族旅行',
  emoji: '🇹🇭',
  startDate: '2027-01-18', // 第一天（泰國日期）
  endDate: '2027-01-23', // 最後一天
  // 出發倒數的目標時間（台灣時間 +08:00）＝ 去程 BR201 起飛
  departure: '2027-01-18T09:45:00+08:00',
  departureLabel: '桃園機場起飛',
  members: 9,
}

/**
 * Google Sheet「發佈到網路」的 CSV 網址（每個工作表各一個）
 * 留空字串 = 使用 src/data/sample.ts 裡的範例資料
 * 設定方式見 docs/GOOGLE_SHEET.md
 */
export const SHEETS = {
  // 行程
  itinerary:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8zPRyt8k7QRU4mJB3P-8680g8RbjgF5Ye8UVi6qlKvk-vZl0iYI3Ge6qL3MTRh8-cmDrZkxHgceer/pub?output=csv',
  // 成員（另一份只有總召能編輯的試算表）
  members:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh8EIteI3lXAmKu-WECcAuSaQj1H2s_ToIZ4Se9kzBcg4cjEvCTez1xtNfqCij7zz2gylM_2823_Na/pub?output=csv',
}

export type Flight = {
  label: string // 去程 / 回程
  code: string // 班機號碼
  from: string
  to: string
  depart: string // ISO 時間，含時區
  arrive: string
  terminal?: string
  note?: string
}

export const FLIGHTS: Flight[] = [
  {
    label: '去程',
    code: '長榮 BR201',
    from: '桃園 TPE',
    to: '曼谷 BKK 蘇凡納布',
    depart: '2027-01-18T09:45:00+08:00',
    arrive: '2027-01-18T12:50:00+07:00',
    terminal: '桃園第二航廈',
    note: '07:15 在桃園機場第二航廈集合（起飛前 2.5 小時）',
  },
  {
    label: '回程',
    code: '長榮 BR202',
    from: '曼谷 BKK 蘇凡納布',
    to: '桃園 TPE',
    depart: '2027-01-23T14:35:00+07:00',
    arrive: '2027-01-23T19:15:00+08:00',
    note: '11:00 從住宿出發前往機場',
  },
]

export type Hotel = {
  name: string
  nameTh: string // 給司機看的名稱（泰文，沒有就用英文）
  addressTh: string // 泰文地址
  addressEn?: string
  phone?: string
  checkIn: string // YYYY-MM-DD
  checkOut: string
  checkInTime?: string // 例如 15:00 後
  mapUrl?: string
  wifi?: { ssid: string; password: string }
  rules?: string[] // 住宿注意事項
}

// 住宿（可多間，依入住日期自動切換）
export const HOTELS: Hotel[] = [
  {
    name: 'HAUS109（Airbnb）',
    nameTh: 'HAUS109',
    addressTh: '166/14 ซอยพหลโยธิน 14 แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400',
    addressEn: '166/14 Soi Phahon Yothin 14, Samsen Nai, Phaya Thai, Bangkok 10400',
    checkIn: '2027-01-18',
    checkOut: '2027-01-23',
    checkInTime: '15:00 後',
    mapUrl: 'https://maps.app.goo.gl/3XecMY7QRWWkCJnUA',
    wifi: { ssid: 'HAUS109_2.4G / HAUS109_5G', password: 'Guest109' },
    rules: [
      '自助入住：大門密碼會在抵達前一天公布在 LINE 群組',
      '寧靜時間 23:00–06:00（戶外區域請降低音量）',
    ],
  },
]

export type WeatherPlace = {
  from: string // 這天起使用這個地點的天氣
  name: string
  lat: number
  lon: number
  climate: string // 還沒進入預報範圍時顯示的氣候說明
}

// 天氣地點（若行程有換城市，例如去芭達雅，再加一筆）
export const WEATHER_PLACES: WeatherPlace[] = [
  {
    from: '2027-01-18',
    name: '曼谷',
    lat: 13.7563,
    lon: 100.5018,
    climate: '1 月是曼谷的乾季，白天約 31–33°C、早晚約 22–24°C，很少下雨。白天日曬強，室內冷氣很冷。',
  },
]

// 走散時怎麼辦（緊急資訊頁顯示）
export const LOST_TIPS: string[] = [
  '先在 LINE 群組說你在哪裡，用 LINE 傳「位置資訊」最清楚',
  '不要亂走，留在原地等人來找你',
  '手機沒電或沒網路：請店員或觀光警察（1155）幫忙',
  '真的找不到人，就直接回住宿 HAUS109 等（用「給司機看住宿地址」叫車）',
]
