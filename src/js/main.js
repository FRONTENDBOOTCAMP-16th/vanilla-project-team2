// ✅ 레이아웃(헤더/푸터) 삽입
async function loadLayout() {
  const body = document.body

  const showHeader = body.dataset.showHeader !== 'false'
  const showFooter = body.dataset.showFooter !== 'false'

  // component.html 가져오기
  const res = await fetch('/src/components/component.html')
  const html = await res.text()

  const temp = document.createElement('div')
  temp.innerHTML = html

  const header = temp.querySelector('header')
  const footer = temp.querySelector('footer')

  if (showHeader && header) body.prepend(header)
  if (showFooter && footer) body.append(footer)
}

// ✅ 로그인 상태에 따라 헤더 버튼 제어
function controlAuthUI() {
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  const mypage = document.querySelector('[data-role="mypage"]')
  const login = document.querySelector('[data-role="login"]')
  const logout = document.querySelector('[data-role="logout"]')

  // 헤더가 없는 페이지(로그인 페이지 등)면 그냥 종료
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

// ✅ 로그아웃 클릭 이벤트
function bindLogout() {
  const logoutBtn = document.querySelector('[data-role="logout"]')
  if (!logoutBtn) return

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.clear()
    location.href = '/src/pages/login/index.html'
  })
}

// ✅ 페이지별 init (필요하면 여기서 qna 페이지 코드도 실행)
function initByPage() {
  const page = document.body.dataset.page

  switch (page) {
    case 'qna':
      // QnA 페이지에서만 필요한 초기화 코드가 있으면 여기서 호출
      // initQna();
      break

    case 'dashboard':
      // initDashboard();
      break

    default:
      break
  }
}

// ✅ 부팅 순서: 레이아웃 → UI 제어 → 이벤트 → 페이지 init
await loadLayout()
controlAuthUI()
bindLogout()
initByPage()
