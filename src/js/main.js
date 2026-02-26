// ===============================
// 공통 레이아웃(header / footer) 불러오기
// ===============================
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

// ===============================
// 토큰 존재 여부(가벼운 체크)
// - JWT.js/checkToken() 호출 금지!
// ===============================
function hasAccessToken() {
  // 프로젝트에서 쓰는 키명에 맞춰 하나로 통일하는 게 베스트지만,
  // 지금은 안전하게 둘 다 확인
  return Boolean(
    localStorage.getItem('accessToken') || localStorage.getItem('token'),
  )
}

// ===============================
// 로그인 상태에 따라 UI 표시 제어
// - auth 플래그만 믿으면 불일치가 생길 수 있어서,
//   가능하면 토큰 기준을 우선으로 둠
// ===============================
function controlAuthUI() {
  const isLoggedIn = localStorage.getItem('auth') === 'true' || hasAccessToken()

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

// ===============================
// 로그아웃 버튼 이벤트 연결
// ===============================
function bindLogout() {
  const logoutBtn = document.querySelector('[data-role="logout"]')
  if (!logoutBtn) return

  logoutBtn.addEventListener(
    'click',
    (e) => {
      e.preventDefault()
      localStorage.clear()

      // ✅ 네 실제 로그인 경로로 맞춰
      location.href = '/src/pages/users/login/index.html'
    },
    { once: true },
  )
}

// ===============================
// 페이지별 초기화 처리
// - 핵심: qna 페이지는 "토큰 있을 때만 user 관련 로직 실행" 옵션을 넘김
// ===============================
async function initByPage() {
  const page = document.body.dataset.page

  switch (page) {
    case 'qna': {
      // ✅ qna.page.js가 있다면 동적 import로 실행(권장)
      // qna.page.js에서 start({ enableUser: true/false }) 형태로 받도록 만들면 깔끔함
      const { start } = await import('./components/qna.page.js')

      start({
        enableUser: hasAccessToken(), // 토큰 있을 때만 유저 로직 활성화
      })
      break
    }

    case 'dashboard': {
      // 예시: 대시보드도 필요하면 같은 방식으로 분리 가능
      // const { start } = await import('./components/dashboard.page.js')
      // start()
      break
    }

    default:
      break
  }
}

// ===============================
// 현재 페이지에 맞게 네비 active 표시
// ===============================
function setActiveNav() {
  const nav = document.querySelector('nav.nav')
  if (!nav) return

  const links = Array.from(nav.querySelectorAll('a.nav-item'))
  if (links.length === 0) return

  const currentPath = location.pathname.replace(/\/+$/, '')
  links.forEach((a) => a.classList.remove('active'))

  let activeLink = links.find((a) => {
    const href = a.getAttribute('href')
    if (!href) return false
    const hrefPath = new URL(href, location.origin).pathname.replace(/\/+$/, '')
    return hrefPath === currentPath
  })

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

// ===============================
// 앱 시작 순서
// - 레이아웃 먼저 → nav/logout DOM 생성
// - 그 다음 UI 바인딩
// - 마지막에 페이지별 스크립트 실행(옵션 전달)
// ===============================
async function init() {
  try {
    await loadLayout()
    setActiveNav()
    controlAuthUI()
    bindLogout()

    // ✅ 페이지 스크립트는 마지막에
    await initByPage()
  } catch (e) {
    console.error('[init] failed:', e)
  }
}

init()
