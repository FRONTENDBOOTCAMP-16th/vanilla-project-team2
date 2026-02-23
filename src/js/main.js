async function loadLayout() {
  const body = document.body

  const showHeader = body.dataset.showHeader !== 'false'
  const showFooter = body.dataset.showFooter !== 'false'

  const res = await fetch('/components/component.html', { cache: 'no-store' })
  if (!res.ok) {
    console.error('layout fetch failed:', res.status, res.statusText)
    return
  }

  const html = await res.text()

  const temp = document.createElement('div')
  temp.innerHTML = html

  const header = temp.querySelector('header')
  const footer = temp.querySelector('footer')

  if (showHeader && header) body.prepend(header)
  if (showFooter && footer) body.append(footer)
}

function controlAuthUI() {
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  const mypage = document.querySelector('[data-role="mypage"]')
  const login = document.querySelector('[data-role="login"]')
  const logout = document.querySelector('[data-role="logout"]')

  if (!mypage || !login || !logout) return

  if (isLoggedIn) {
    mypage.style.display = ''
    logout.style.display = ''
    login.style.display = 'none'
  } else {
    mypage.style.display = 'none'
    logout.style.display = 'none'
    login.style.display = ''
  }
}

function bindLogout() {
  const logoutBtn = document.querySelector('[data-role="logout"]')
  if (!logoutBtn) return

  logoutBtn.addEventListener(
    'click',
    (e) => {
      e.preventDefault()
      localStorage.clear()

      // ✅ 여기만 "배포된 로그인 경로"로 바꾸기
      location.href = '/login/index.html' // ← 너희 dist 기준으로 수정!
    },
    { once: true },
  )
}

function initByPage() {
  const page = document.body.dataset.page
  switch (page) {
    case 'qna':
      break
    case 'dashboard':
      break
    default:
      break
  }
}

await loadLayout()
controlAuthUI()
bindLogout()
initByPage()
