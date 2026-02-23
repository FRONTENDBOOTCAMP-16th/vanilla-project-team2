import { postItem } from '../../js/components/postItem.js'

// ---------------------------
// ✅ 모드 판별 (home vs qna)
// ---------------------------
const PAGE = document.body?.dataset?.page || ''
const IS_HOME = PAGE === 'home' // home index.html에 <body data-page="home"> 여야 함

// 홈은 8개 고정, QnA는 기존대로 페이지네이션
const ITEMS_PER_PAGE = IS_HOME ? 8 : 8
const PAGE_COUNT = 5

let qnaData = []
let currentPage = 1
let currentDisplayData = qnaData

// DOM 참조는 "DOM 로드 후" 안전하게 잡기 위해 함수 안에서 잡을 거야
let qnaPostUl = null
let paginationList = null
let firstButton = null
let prevButton = null
let nextButton = null
let nextGroupButton = null
let searchInput = null
let paginationRoot = null

// ---------------------------
// ✅ 렌더: 게시글
// ---------------------------
const renderPosts = function (page, data) {
  if (!qnaPostUl) return

  if (!data || data.length === 0) {
    qnaPostUl.innerHTML = `
      <li class="main-post__no-result">
        <p>검색 결과가 없습니다.</p>
      </li>
    `
    return
  }

  // ✅ Home는 "최신 8개"만 (페이지네이션 없음)
  if (IS_HOME) {
    const sliceData = data.slice(0, ITEMS_PER_PAGE)
    qnaPostUl.innerHTML = sliceData.map((post) => postItem(post)).join('')
    return
  }

  // ✅ QnA는 페이지네이션
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const sliceData = data.slice(startIndex, endIndex)

  qnaPostUl.innerHTML = sliceData.map((post) => postItem(post)).join('')
}

// ---------------------------
// ✅ 페이지네이션 이벤트 세팅
// ---------------------------
const setupPaginationEvents = function (data) {
  if (IS_HOME) return
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      updateUI(data)
    })
  })
}

// ---------------------------
// ✅ 렌더: 페이지네이션
// ---------------------------
const renderPagination = function (data) {
  // 홈은 페이지네이션을 아예 숨김(있어도)
  if (IS_HOME) {
    if (paginationRoot) paginationRoot.classList.add('hidden')
    return
  }

  // QnA인데 pagination DOM이 없으면 스킵 (에러 방지)
  if (!paginationList || !firstButton || !nextGroupButton) return

  let htmlString = ''
  const currentTotalPage = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE)
  const currentGroup = Math.ceil(currentPage / PAGE_COUNT)
  const totalGroup = Math.ceil(currentTotalPage / PAGE_COUNT)

  const startPage = (currentGroup - 1) * PAGE_COUNT + 1
  const endPage = Math.min(startPage + PAGE_COUNT - 1, currentTotalPage)

  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === currentPage ? 'is-active' : ''
    htmlString += `
      <li class="pagination__item">
        <button type="button" class="pagination__link ${activeClass}">${i}</button>
      </li>
    `
  }

  paginationList.innerHTML = htmlString

  firstButton.classList.toggle('hidden', currentGroup === 1)
  nextGroupButton.classList.toggle(
    'hidden',
    currentGroup === totalGroup || currentTotalPage === 0,
  )

  setupPaginationEvents(data)
}

// ---------------------------
// ✅ UI 업데이트
// ---------------------------
const updateUI = function (data) {
  currentDisplayData = data || []
  renderPosts(currentPage, currentDisplayData)
  renderPagination(currentDisplayData)
}

// ---------------------------
// ✅ 이벤트 연결 (DOM 있을 때만)
// ---------------------------
function bindEvents() {
  // 검색 (있는 페이지에서만)
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.toLowerCase().trim()
      const searchedData = qnaData.filter(({ subject }) =>
        (subject || '').toLowerCase().includes(keyword),
      )

      currentPage = 1
      updateUI(searchedData)
    })
  }

  // 홈은 페이지네이션 버튼 이벤트 불필요
  if (IS_HOME) return

  if (nextGroupButton) {
    nextGroupButton.addEventListener('click', () => {
      const currentTotalPage = Math.ceil(
        currentDisplayData.length / ITEMS_PER_PAGE,
      )
      const currentGroup = Math.ceil(currentPage / PAGE_COUNT)
      currentPage = Math.min(currentGroup * PAGE_COUNT + 1, currentTotalPage)
      updateUI(currentDisplayData)
    })
  }

  if (firstButton) {
    firstButton.addEventListener('click', () => {
      const currentGroup = Math.ceil(currentPage / PAGE_COUNT)
      // ✅ 버그 수정: 그룹 첫 페이지로 이동은 +1이 맞음
      currentPage = (currentGroup - 1) * PAGE_COUNT + 1
      updateUI(currentDisplayData)
    })
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentPage = Math.max(currentPage - 1, 1)
      updateUI(currentDisplayData)
    })
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const currentTotalPage = Math.ceil(
        currentDisplayData.length / ITEMS_PER_PAGE,
      )
      currentPage = Math.min(currentPage + 1, currentTotalPage)
      updateUI(currentDisplayData)
    })
  }

  // 클릭 이동 (리스트 있을 때만)
  if (qnaPostUl) {
    qnaPostUl.addEventListener('click', (e) => {
      e.preventDefault()
      const item = e.target.closest('.main-post__item')
      if (!item) return

      const postId = item.dataset.id
      localStorage.setItem('selectedPostId', postId)
      localStorage.setItem('selectedBoardId', 2)

      // ✅ 홈에서 실행될 때도 readpost로 잘 가게 "절대경로" 추천
      location.href = '/src/pages/readpost/index.html'
    })
  }
}

// ---------------------------
// ✅ 데이터 로드
// ---------------------------
async function init() {
  try {
    const postResponse = await fetch(
      'https://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=2&page=1',
    )

    if (!postResponse.ok) throw new Error('데이터 불러오기 실패')

    const responseData = await postResponse.json()
    const actualPosts = responseData.data
    if (!Array.isArray(actualPosts)) {
      updateUI([])
      return
    }

    actualPosts.sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )
    const qnaPosts = actualPosts.filter((item) => Number(item.board_id) === 2)

    // 댓글
    const commentsPromises = qnaPosts.map(async (post) => {
      try {
        const res = await fetch(
          `https://leedh9276.dothome.co.kr/likelion-vanilla/comment/read.php?post_id=${post.post_id}`,
        )
        const result = await res.json()
        console.log(`글번호 ${post.post_id}의 결과:`, result)

        return Array.isArray(result) ? result.length : 0
      } catch {
        return 0
      }
    })

    const commentsCounts = await Promise.all(commentsPromises)

    qnaData = qnaPosts.map((post, index) => {
      return {
        post_id: post.post_id,
        board_id: post.board_id,
        user_id: post.user_id,
        user_nickname: post.user_nickname || post.nickname || '사용자',
        subject: post.subject,
        contents: post.contents,
        type: post.type,
        // 💡 해결 2: 날짜 데이터가 깨끗한지 확인 (앞뒤 공백 제거)
        create_date: post.create_date ? post.create_date.trim() : '',
        commentCount: myComments.length,
      }
    })

    currentPage = 1
    updateUI(qnaData)
  } catch (error) {
    console.error('에러 발생:', error)
    updateUI([])
  }
}

// ---------------------------
// ✅ 앱 시작 (DOM 로드 타이밍 안전)
// ---------------------------
function start() {
  // DOM 참조
  qnaPostUl = document.querySelector('.main-post__list')
  paginationList = document.querySelector('.pagination__list')
  firstButton = document.querySelector('.pagination__control--first')
  prevButton = document.querySelector('.pagination__control--prev')
  nextButton = document.querySelector('.pagination__control--next')
  nextGroupButton = document.querySelector('.pagination__control--next-group')
  searchInput = document.querySelector('#main-search__item')
  paginationRoot = document.querySelector('.pagination')

  bindEvents()
  init()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start)
} else {
  start()
}
