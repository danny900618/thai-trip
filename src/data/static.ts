export type Phone = { name: string; desc: string; dial: string; display: string; urgent?: boolean }

export const EMERGENCY_THAI: Phone[] = [
  { name: '觀光警察', desc: '可說英文，遊客遇到任何問題首選', dial: '1155', display: '1155', urgent: true },
  { name: '救護車／急救', desc: '醫療緊急狀況', dial: '1669', display: '1669', urgent: true },
  { name: '警察', desc: '泰語為主', dial: '191', display: '191' },
  { name: '消防', desc: '', dial: '199', display: '199' },
]

export const EMERGENCY_TW: Phone[] = [
  {
    name: '駐泰國台北經濟文化辦事處（急難專線）',
    desc: '護照遺失、意外、被捕等重大急難，24 小時（國外手機撥 +66 81-666-4006）',
    dial: '+66816664006',
    display: '081-666-4006',
    urgent: true,
  },
  {
    name: '駐泰國台北經濟文化辦事處（一般領務）',
    desc: '週一至週五 09:00–17:00，非緊急事務',
    dial: '+6621193555',
    display: '+66 2-119-3555',
  },
  {
    name: '外交部旅外國人急難救助專線',
    desc: '從國外撥打（需付費）',
    dial: '+886800085095',
    display: '+886-800-085-095',
  },
]

export type PackItem = { id: string; text: string; detail?: string }

/** 去泰國「一定要帶／要準備」的東西（精簡版） */
export const PACKING: PackItem[] = [
  { id: 'passport', text: '護照', detail: '效期需在入境日起 6 個月以上，出發前請再確認' },
  { id: 'tdac', text: '入境卡 TDAC QR code', detail: '已統一代辦，請確認「我的」頁面打得開，並截圖存在手機' },
  { id: 'cash', text: '泰銖現金＋信用卡', detail: '小攤販、按摩、市場多數只收現金' },
  { id: 'net', text: '網路（eSIM／SIM 卡／漫遊）', detail: '叫車、看地圖、看這個網站都需要' },
  { id: 'plug', text: '轉接頭＋確認電器電壓', detail: '泰國 220V。手機充電器多半通用；台灣的吹風機、電棒捲若只支援 110V 會燒壞' },
  { id: 'powerbank', text: '行動電源放隨身行李', detail: '不可托運；機上通常禁止使用或充電，依航空公司規定' },
  { id: 'temple', text: '進寺廟的衣服', detail: '需遮住肩膀與膝蓋：長褲／長裙、薄外套或披巾' },
  { id: 'sun', text: '防曬、帽子、太陽眼鏡' },
  { id: 'mosquito', text: '防蚊液' },
  { id: 'jacket', text: '薄外套', detail: '商場、車上冷氣很強' },
  { id: 'medicine', text: '常備藥品', detail: '腸胃藥、止痛藥、暈車藥、個人慢性病用藥（放隨身行李）' },
]

export type Notice = { icon: string; title: string; body: string; level?: 'danger' | 'warn' }

export const NOTICES: Notice[] = [
  {
    icon: '🚭',
    title: '電子菸在泰國是違法的',
    body: '攜帶、使用都可能被處以高額罰款甚至拘留，請不要帶。',
    level: 'danger',
  },
  {
    icon: '🥩',
    title: '肉製品不要帶回台灣',
    body: '肉乾、肉鬆、含肉泡麵、豬肉製品等都禁止攜帶入境台灣，被查到罰款新台幣 20 萬元起。',
    level: 'danger',
  },
  {
    icon: '🌿',
    title: '不要購買或食用大麻相關產品',
    body: '包含大麻餅乾、飲料。帶回台灣屬於毒品，後果嚴重。',
    level: 'danger',
  },
  {
    icon: '👑',
    title: '尊重皇室',
    body: '不要批評或開皇室玩笑；鈔票上有國王肖像，掉了不要用腳踩住。',
    level: 'warn',
  },
  {
    icon: '🛕',
    title: '寺廟禮儀',
    body: '遮肩膝、進殿脫鞋、不要用腳指向佛像。女生不要碰觸僧侶或直接遞東西給僧侶。',
    level: 'warn',
  },
  {
    icon: '🙏',
    title: '不要摸別人的頭',
    body: '泰國人認為頭部神聖，小朋友也一樣。',
  },
  {
    icon: '🕐',
    title: '時差：泰國比台灣慢 1 小時',
    body: '本網站行程時間都是泰國當地時間。',
  },
  {
    icon: '🚕',
    title: '叫車用 Grab／Bolt',
    body: '價格透明不會被喊價。路邊計程車請要求跳表（meter），嘟嘟車要先談好價錢。',
  },
  {
    icon: '💧',
    title: '自來水不要生飲',
    body: '喝瓶裝水。路邊冰塊多數是工廠製冰，腸胃比較敏感的人還是小心。',
  },
  {
    icon: '💸',
    title: '小費',
    body: '按摩約 50–100 泰銖，飯店行李員 20–50 泰銖，餐廳若帳單已含服務費就不用另外給。',
  },
]
