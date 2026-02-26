// ===============================
// 공통 레이아웃(header / footer) 불러오기
// ===============================
async function loadLayout() {
  // 현재 문서의 <body> 요소
  const body = document.body

  // body의 data 속성으로 header/footer 표시 여부 결정
  // <body data-show-header="false"> 이면 숨김
  // 속성이 없으면 기본 true (표시)
  const showHeader = body.dataset.showHeader !== 'false'
  const showFooter = body.dataset.showFooter !== 'false'

  // header + footer가 들어있는 공통 HTML 파일 요청
  // cache: 'no-store' → 항상 최신 파일 가져오기 (캐시 사용 안함)
  const res = await fetch('/components/component.html', { cache: 'no-store' })

  // 요청 실패 시 콘솔에 에러만 출력하고 중단
  if (!res.ok) {
    console.error('layout fetch failed:', res.status, res.statusText)
    return
  }

  // HTML 문자열로 변환
  const html = await res.text()

  // 문자열을 DOM으로 바꾸기 위한 임시 컨테이너
  const temp = document.createElement('div')
  temp.innerHTML = html

  // component.html 안에서 header, footer 태그 찾기
  const header = temp.querySelector('header')
  const footer = temp.querySelector('footer')

  // header 표시 설정이면 body 맨 위에 삽입
  // prepend → body의 첫 자식으로 들어감
  if (showHeader && header) body.prepend(header)

  // footer 표시 설정이면 body 맨 아래에 삽입
  // append → body의 마지막 자식으로 들어감
  if (showFooter && footer) body.append(footer)
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
      e.preventDefault()

      // 로그인 관련 정보 전부 삭제
      // (auth, token 등 모두 제거됨)
      localStorage.clear()

      // 로그인 페이지로 이동
      // ※ 실제 로그인 페이지 경로에 맞게 유지
      location.href = '/login/index.html'
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
}

init()
