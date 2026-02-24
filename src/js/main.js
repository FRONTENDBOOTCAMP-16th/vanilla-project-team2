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
      location.href = '/login/index.html'
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

function setActiveNav() {
  const nav = document.querySelector('nav.nav')
  if (!nav) return

  const links = Array.from(nav.querySelectorAll('a.nav-item'))
  if (links.length === 0) return

  // 현재 경로 (쿼리스트링/해시 제거)
  const currentPath = location.pathname.replace(/\/+$/, '')

  // 모든 active 제거
  links.forEach((a) => a.classList.remove('active'))

  // 1) href와 pathname이 정확히 일치하는 링크 찾기
  let activeLink = links.find((a) => {
    const href = a.getAttribute('href')
    if (!href) return false
    const hrefPath = new URL(href, location.origin).pathname.replace(/\/+$/, '')
    return hrefPath === currentPath
  })

  // 2) 정확히 일치가 없으면 "폴더 index.html" 케이스 보정
  // 예: /src/pages/qna/ 로 들어왔는데 실제 파일은 /src/pages/qna/index.html 인 경우
  if (!activeLink) {
    activeLink = links.find((a) => {
      const href = a.getAttribute('href')
      if (!href) return false
      const hrefPath = new URL(href, location.origin).pathname.replace(
        /\/+$/,
        '',
      )
      return currentPath.endsWith(hrefPath.replace('/index.html', ''))
    })
  }

  if (activeLink) activeLink.classList.add('active')
}

await loadLayout()
setActiveNav()
controlAuthUI()
bindLogout()
initByPage()
