// ===============================
// 공통 레이아웃(header / footer) 동적 로드
// ===============================
async function loadLayout() {
  const body = document.body

  // <body data-show-header="false"> 로 숨김 제어
  const showHeader = body.dataset.showHeader !== 'false'
  const showFooter = body.dataset.showFooter !== 'false'

  // ---------------------------
  // 1) HEADER 로드
  // ---------------------------
  if (showHeader) {
    const headerRes = await fetch('/components/header.html', {
      cache: 'no-store',
    })

    if (!headerRes.ok) {
      console.error(
        'header load failed:',
        headerRes.status,
        headerRes.statusText,
      )
    } else {
      const headerHtml = await headerRes.text()

      const temp = document.createElement('div')
      temp.innerHTML = headerHtml

      // header.html의 실제 <header> 요소 추출
      const header = temp.querySelector('header') || temp.firstElementChild

      if (header) body.prepend(header)
    }
  }

  // ---------------------------
  // 2) FOOTER 로드
  // ---------------------------
  if (showFooter) {
    const footerRes = await fetch('/components/footer.html', {
      cache: 'no-store',
    })

    if (!footerRes.ok) {
      console.error(
        'footer load failed:',
        footerRes.status,
        footerRes.statusText,
      )
    } else {
      const footerHtml = await footerRes.text()

      const temp = document.createElement('div')
      temp.innerHTML = footerHtml

      // footer.html의 실제 <footer> 요소 추출
      const footer = temp.querySelector('footer') || temp.firstElementChild

      if (footer) body.append(footer)
    }
  }
}
// ===============================
// 로그인 상태에 따라 UI 표시 제어
// ===============================
function controlAuthUI() {
  // localStorage에 저장된 로그인 여부 확인
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  // 헤더 메뉴 요소들 선택
  const mypage = document.querySelector('[data-role="mypage"]')
  const login = document.querySelector('[data-role="login"]')
  const logout = document.querySelector('[data-role="logout"]')

  // 요소가 없으면 실행 중단 (페이지마다 header가 없을 수 있음)
  if (!mypage || !login || !logout) return

  // 로그인 상태일 때 → 마이페이지, 로그아웃 표시 / 로그인 숨김
  if (isLoggedIn) {
    mypage.style.display = ''
    logout.style.display = ''
    login.style.display = 'none'
  }
  // 비로그인 상태 → 로그인 표시 / 나머지 숨김
  else {
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
      // a 태그 기본 이동 방지
      e.preventDefault()

      // 로그인 정보 전체 삭제
      localStorage.clear()

      // 로그인 페이지로 이동
      location.href = '/login/index.html'
    },
    // 한 번만 실행되도록 (중복 클릭 방지)
    { once: true },
  )
}

// ===============================
// 페이지별 초기화 실행 (라우팅 역할)
// ===============================
function initByPage() {
  // body에 선언된 data-page 값 읽기
  // <body data-page="qna">
  const page = document.body.dataset.page

  // 페이지 이름에 따라 각 페이지 전용 스크립트 실행
  switch (page) {
    case 'qna':
      // QnA 페이지 전용 코드 실행 위치
      break
    case 'dashboard':
      // 대시보드 페이지 전용 코드 실행 위치
      break
    default:
      break
  }
}

// ===============================
// 현재 페이지 메뉴 active 처리
// ===============================
function setActiveNav() {
  const nav = document.querySelector('nav.nav')
  if (!nav) return

  const links = Array.from(nav.querySelectorAll('a.nav-item'))
  if (links.length === 0) return

  // 현재 주소의 경로 (쿼리스트링, 해시 제거)
  const currentPath = location.pathname.replace(/\/+$/, '')

  // 기존 active 전부 제거
  links.forEach((a) => a.classList.remove('active'))

  // 1️⃣ href 경로와 현재 경로가 정확히 같은 메뉴 찾기
  let activeLink = links.find((a) => {
    const href = a.getAttribute('href')
    if (!href) return false

    const hrefPath = new URL(href, location.origin).pathname.replace(/\/+$/, '')
    return hrefPath === currentPath
  })

  // 2️⃣ /qna/ → /qna/index.html 같은 경우 보정
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

  // 찾았으면 active 부여
  if (activeLink) activeLink.classList.add('active')
}

// ===============================
// 앱 초기 실행 순서 (매우 중요)
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  await loadLayout()
  setActiveNav()
  controlAuthUI()
  bindLogout()
  initByPage()
})
