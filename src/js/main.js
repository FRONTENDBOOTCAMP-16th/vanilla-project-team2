// ===============================
<<<<<<< HEAD
// 공통 레이아웃(header / footer) 불러오기
=======
// 공통 레이아웃(header / footer) 동적 로드
>>>>>>> feature_hk_02
// ===============================
async function loadLayout() {
  // 현재 문서의 <body> 요소
  const body = document.body

<<<<<<< HEAD
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

=======
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
>>>>>>> feature_hk_02
// ===============================
// 로그인 상태에 따라 UI 표시 제어
// ===============================
function controlAuthUI() {
<<<<<<< HEAD
  // localStorage의 auth 값이 'true'면 로그인 상태로 판단
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  // data-role 속성으로 헤더 버튼들 찾기
=======
  // localStorage에 저장된 로그인 여부 확인
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  // 헤더 메뉴 요소들 선택
>>>>>>> feature_hk_02
  const mypage = document.querySelector('[data-role="mypage"]')
  const login = document.querySelector('[data-role="login"]')
  const logout = document.querySelector('[data-role="logout"]')

<<<<<<< HEAD
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
=======
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
>>>>>>> feature_hk_02
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

<<<<<<< HEAD
      // 로그인 관련 정보 전부 삭제
      // (auth, token 등 모두 제거됨)
      localStorage.clear()

      // 로그인 페이지로 이동
      // ※ 실제 로그인 페이지 경로에 맞게 유지
      location.href = '/login/index.html'
    },
    { once: true }, // 이벤트 1회만 실행 (중복 로그아웃 방지)
=======
      // 로그인 정보 전체 삭제
      localStorage.clear()

      // 로그인 페이지로 이동
      location.href = '/login/index.html'
    },
    // 한 번만 실행되도록 (중복 클릭 방지)
    { once: true },
>>>>>>> feature_hk_02
  )
}

// ===============================
<<<<<<< HEAD
// 페이지별 초기화 처리
// ===============================
function initByPage() {
  // <body data-page="qna"> 같은 값 읽기
  const page = document.body.dataset.page

  // 페이지별로 필요한 JS 실행 구분
  switch (page) {
    case 'qna':
      // QnA 페이지 전용 스크립트 위치
=======
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
>>>>>>> feature_hk_02
      break

    case 'dashboard':
<<<<<<< HEAD
      // 대시보드 페이지 전용 스크립트 위치
=======
      // 대시보드 페이지 전용 코드 실행 위치
>>>>>>> feature_hk_02
      break

    default:
      break
  }
}

// ===============================
<<<<<<< HEAD
// 현재 페이지에 맞게 네비 active 표시
=======
// 현재 페이지 메뉴 active 처리
>>>>>>> feature_hk_02
// ===============================
function setActiveNav() {
  // nav 영역 찾기
  const nav = document.querySelector('nav.nav')
  if (!nav) return

  // nav 안의 모든 링크 수집
  const links = Array.from(nav.querySelectorAll('a.nav-item'))
  if (links.length === 0) return

<<<<<<< HEAD
  // 현재 URL 경로 가져오기
  // 뒤에 붙은 / 제거
  // 예: /qna/ → /qna
  const currentPath = location.pathname.replace(/\/+$/, '')

  // 기존 active 클래스 전부 제거
  links.forEach((a) => a.classList.remove('active'))

  // ---------------------------
  // 1️⃣ href와 정확히 같은 링크 찾기
  // ---------------------------
=======
  // 현재 주소의 경로 (쿼리스트링, 해시 제거)
  const currentPath = location.pathname.replace(/\/+$/, '')

  // 기존 active 전부 제거
  links.forEach((a) => a.classList.remove('active'))

  // 1️⃣ href 경로와 현재 경로가 정확히 같은 메뉴 찾기
>>>>>>> feature_hk_02
  let activeLink = links.find((a) => {
    const href = a.getAttribute('href')
    if (!href) return false

<<<<<<< HEAD
    // 상대경로 → 절대경로 변환 후 pathname 비교
=======
>>>>>>> feature_hk_02
    const hrefPath = new URL(href, location.origin).pathname.replace(/\/+$/, '')
    return hrefPath === currentPath
  })

<<<<<<< HEAD
  // ---------------------------
  // 2️⃣ index.html 생략 접근 보정
  // 예: /qna/ 로 접근했지만 실제 링크는 /qna/index.html
  // ---------------------------
=======
  // 2️⃣ /qna/ → /qna/index.html 같은 경우 보정
>>>>>>> feature_hk_02
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

<<<<<<< HEAD
  // 찾으면 active 클래스 추가 (현재 메뉴 강조 표시)
=======
  // 찾았으면 active 부여
>>>>>>> feature_hk_02
  if (activeLink) activeLink.classList.add('active')
}

// ===============================
<<<<<<< HEAD
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
=======
// 앱 초기 실행 순서 (매우 중요)
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  await loadLayout()
  setActiveNav()
  controlAuthUI()
  bindLogout()
  initByPage()
})
>>>>>>> feature_hk_02
