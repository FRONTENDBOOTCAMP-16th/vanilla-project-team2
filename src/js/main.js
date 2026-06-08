// ===============================
// 공통 레이아웃(header / footer) 불러오기
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
    const headerRes = await fetch((window.ROOT_PATH || './') + 'components/header.html', {
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

      const rootPath = window.ROOT_PATH || './';
      temp.querySelectorAll('[href^="/"]').forEach(el => {
        el.setAttribute('href', rootPath + el.getAttribute('href').substring(1));
      });
      temp.querySelectorAll('[src^="/"]').forEach(el => {
        el.setAttribute('src', rootPath + el.getAttribute('src').substring(1));
      });

      // header.html의 실제 <header> 요소 추출
      const header = temp.querySelector('header') || temp.firstElementChild

      if (header) body.prepend(header)

      // 오버레이도 추가
      const overlay = temp.querySelector('.mobile-overlay')
      if (overlay) body.insertBefore(overlay, header.nextSibling)

      // 플로팅 글쓰기 버튼 추가
      const floatingBtn = temp.querySelector('.floating-write-btn')
      if (floatingBtn) body.append(floatingBtn)
    }
  }

  // ---------------------------
  // 2) FOOTER 로드
  // ---------------------------
  if (showFooter) {
    const footerRes = await fetch((window.ROOT_PATH || './') + 'components/footer.html', {
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

      const rootPath = window.ROOT_PATH || './';
      temp.querySelectorAll('[href^="/"]').forEach(el => {
        el.setAttribute('href', rootPath + el.getAttribute('href').substring(1));
      });
      temp.querySelectorAll('[src^="/"]').forEach(el => {
        el.setAttribute('src', rootPath + el.getAttribute('src').substring(1));
      });

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
  // localStorage의 auth 값이 'true'면 로그인 상태로 판단
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  // data-role 속성으로 헤더 버튼들 찾기
  const mypage = document.querySelector('[data-role="mypage"]')
  const login = document.querySelector('[data-role="login"]')
  const logout = document.querySelector('[data-role="logout"]')

  // 페이지마다 헤더 구조가 다를 수 있으므로
  // 하나라도 없으면 함수 종료
  if (!mypage || !login || !logout) return

  // 로그인 상태일 때
  if (isLoggedIn) {
    mypage.style.display = '' // 마이페이지 표시
    logout.style.display = '' // 로그아웃 표시
    login.style.display = 'none' // 로그인 버튼 숨김
  }
  // 비로그인 상태일 때
  else {
    mypage.style.display = 'none' // 마이페이지 숨김
    logout.style.display = 'none' // 로그아웃 숨김
    login.style.display = '' // 로그인 표시
  }
}

// ===============================
// 로그아웃 버튼 이벤트 연결
// ===============================
function bindLogout() {
  // 로그아웃 버튼 찾기
  const logoutBtn = document.querySelector('[data-role="logout"]')
  if (!logoutBtn) return

  logoutBtn.addEventListener(
    'click',
    (e) => {
      // a 태그 기본 이동 방지
      e.preventDefault()

      // 로그인 관련 정보 전부 삭제
      // (auth, token 등 모두 제거됨)
      localStorage.clear()

      // 로그인 페이지로 이동
      // ※ 실제 로그인 페이지 경로에 맞게 유지
      location.href = (window.ROOT_PATH || './') + 'src/pages/users/login/index.html'
    },
    { once: true }, // 이벤트 1회만 실행 (중복 로그아웃 방지)
  )
}

// ===============================
// 페이지별 초기화 처리
// ===============================
function initByPage() {
  // <body data-page="qna"> 같은 값 읽기
  const page = document.body.dataset.page

  // 페이지별로 필요한 JS 실행 구분
  switch (page) {
    case 'qna':
      // QnA 페이지 전용 스크립트 위치
      break

    case 'dashboard':
      // 대시보드 페이지 전용 스크립트 위치
      break

    default:
      break
  }
}

// ===============================
// 현재 페이지에 맞게 네비 active 표시
// ===============================
function setActiveNav() {
  // nav 영역 찾기
  const nav = document.querySelector('nav.nav')
  if (!nav) return

  // nav 안의 모든 링크 수집
  const links = Array.from(nav.querySelectorAll('a.nav-item'))
  if (links.length === 0) return

  // 현재 URL 경로 가져오기
  // 뒤에 붙은 / 제거
  // 예: /qna/ → /qna
  const currentPath = location.pathname.replace(/\/+$/, '')

  // 기존 active 클래스 전부 제거
  links.forEach((a) => a.classList.remove('active'))

  // ---------------------------
  // 1️⃣ href와 정확히 같은 링크 찾기
  // ---------------------------
  let activeLink = links.find((a) => {
    const href = a.getAttribute('href')
    if (!href) return false

    // 상대경로 → 절대경로 변환 후 pathname 비교
    const hrefPath = new URL(href, location.origin).pathname.replace(/\/+$/, '')
    return hrefPath === currentPath
  })

  // ---------------------------
  // 2️⃣ index.html 생략 접근 보정
  // 예: /qna/ 로 접근했지만 실제 링크는 /qna/index.html
  // ---------------------------
  if (!activeLink) {
    activeLink = links.find((a) => {
      const href = a.getAttribute('href')
      if (!href) return false

      const hrefPath = new URL(href, location.origin).pathname.replace(
        /\/+$/,
        '',
      )

      // /index.html 제거 후 비교
      return currentPath.endsWith(hrefPath.replace('/index.html', ''))
    })
  }

  // 찾으면 active 클래스 추가 (현재 메뉴 강조 표시)
  if (activeLink) activeLink.classList.add('active')
}

// ===============================
// 모바일 메뉴 토글
// ===============================
function bindMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle')
  const nav = document.getElementById('mainNav')
  const overlay = document.getElementById('mobileOverlay')

  if (!toggleBtn || !nav) return

  function openMenu() {
    nav.classList.add('is-open')
    if (overlay) overlay.classList.add('is-active')
    document.body.style.overflow = 'hidden'
    toggleBtn.setAttribute('aria-label', '메뉴 닫기')

    // 닫기 아이콘으로 변경
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `
  }

  function closeMenu() {
    nav.classList.remove('is-open')
    if (overlay) overlay.classList.remove('is-active')
    document.body.style.overflow = ''
    toggleBtn.setAttribute('aria-label', '메뉴 열기')

    // 햄버거 아이콘으로 복원
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    `
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open')
    isOpen ? closeMenu() : openMenu()
  })

  // 오버레이 클릭 시 닫기
  if (overlay) {
    overlay.addEventListener('click', closeMenu)
  }

  // 네비 링크 클릭 시 닫기 (모바일)
  nav.querySelectorAll('a.nav-item').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu()
      }
    })
  })

  // 리사이즈 시 메뉴 상태 초기화
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu()
    }
  })
}

// ===============================
// 헤더 스크롤 효과
// ===============================
function bindHeaderScroll() {
  const header = document.querySelector('header')
  if (!header) return

  let lastScrollY = 0

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    if (scrollY > 10) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }

    lastScrollY = scrollY
  }, { passive: true })
}

// ===============================
// 앱 시작 순서 (페이지 로딩 후 실행)
// ===============================

async function init() {
  // 레이아웃과 상관없는 일은 즉시 실행
  initByPage()

  // 레이아웃이 로드된 후에만 할 수 있는 일들을 묶어주기
  await loadLayout()

  // 이제 헤더/푸터가 확실히 있으니 안심하고 실행
  setActiveNav()
  controlAuthUI()
  bindLogout()
  bindMobileMenu()
  bindHeaderScroll()
}

init()
