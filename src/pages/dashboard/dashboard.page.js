const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const CITY = 'Seoul'

// 날씨 정보
async function renderWeatherTitle() {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=kr`,
  )
  const data = await res.json()

  const temp = Math.round(data.main.temp)
  const desc = data.weather?.[0]?.description ?? '날씨 정보 없음'

  console.log(temp)
  console.log(desc)

  const titleEl = document.querySelector(
    '.dash-card--weather .dash-card__title',
  )
  titleEl.textContent = `${temp}°C · ${desc} `
}

// 명언 정보
async function renderQuote() {
  try {
    const res = await fetch(
      'https://korean-advice-open-api.vercel.app/api/advice',
    )
    const data = await res.json()

    const quote = data.message

    const textEl = document.querySelector(
      '.dash-card__title--quote .quote-text',
    )
    textEl.textContent = quote
  } catch (error) {
    console.error(error)
    document.querySelector('.dash-card__title--quote .quote-text').textContent =
      '명언을 불러오지 못했어요 😢'
  }
}

export async function mountHTML(selector, url) {
  const host = document.querySelector(selector)
  if (!host) return

  const res = await fetch(url)
  const html = await res.text()

  host.innerHTML = html
}

Promise.all([renderWeatherTitle(), renderQuote()])
