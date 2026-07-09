import { postItem } from '../../js/components/postItem.js'
import { checkToken } from '../../api/JWT.js'
import { removeMarkdown } from '../../js/utils/removemarkdown.js'
import { BASE_URL } from '../../api/api.js'

let userData = null

// 인증 API 호출 결과를 메모리에 캐싱해 같은 화면 안에서 반복 검증 비용을 줄인다.
// forceRefresh는 토큰 갱신이나 프로필 변경처럼 최신 사용자 정보가 필요한 흐름에서 사용한다.
async function fetchUserData(forceRefresh = false) {
  if (userData && !forceRefresh) return userData

  const fetchedData = await checkToken()
  if (fetchedData) {
    userData = fetchedData
    return userData
  } else {
    alert('로그인이 필요합니다.')
    window.location.href = (window.ROOT_PATH || './') + 'src/pages/users/login/index.html'
    return
  }
}

// 같은 목록 스크립트를 홈 요약과 QnA 상세 목록에서 공유하므로 body의 data-page로 동작 범위를 나눈다.
const PAGE = document.body?.dataset?.page || ''
const IS_HOME = PAGE === 'home'

let currentPage = 1
let totalPages = 1
let currentSearch = ''
let currentCategory = 'ALL'
const pageCount = 5
const ITEMS_PER_PAGE = 8

let qnaPostUl = null
let paginationList = null
let firstButton = null
let prevButton = null
let nextButton = null
let nextGroupButton = null
let searchInput = null
let paginationRoot = null
let categoryButtons = null

// 화면에 실제로 보여주는 목록을 기준으로 게시글 수, 댓글 수, 주제 수를 다시 계산한다.
const updateOverviewMetrics = function (data = []) {
  const metricPosts = document.querySelectorAll('[data-metric="posts"]')
  const metricComments = document.querySelectorAll('[data-metric="comments"]')
  const metricTopics = document.querySelectorAll('[data-metric="topics"]')

  if (!metricPosts.length && !metricComments.length && !metricTopics.length)
    return

  const commentTotal = data.reduce(
    (sum, post) => sum + (Number(post.commentCount) || 0),
    0,
  )
  const topicTotal = new Set(data.map((post) => post.type || '기타')).size

  metricPosts.forEach((el) => {
    el.textContent = data.length.toLocaleString('ko-KR')
  })
  metricComments.forEach((el) => {
    el.textContent = commentTotal.toLocaleString('ko-KR')
  })
  metricTopics.forEach((el) => {
    el.textContent = topicTotal.toLocaleString('ko-KR')
  })
}

// 홈에서는 전체 목록 중 일부만 미리보기로 보여주고, QnA 페이지에서는 현재 페이지 데이터를 모두 렌더링한다.
const renderPosts = function (data) {
  if (!qnaPostUl) return

  if (!data || data.length === 0) {
    updateOverviewMetrics([])
    qnaPostUl.innerHTML = `
      <li class="post__no-result">
        <p>검색 결과가 없습니다.</p>
      </li>
    `
    return
  }

  const displayData = IS_HOME ? data.slice(0, ITEMS_PER_PAGE) : data
  updateOverviewMetrics(displayData)
  qnaPostUl.innerHTML = displayData.map((post) => postItem(post)).join('')
}

// 페이지 번호는 pageCount 단위로 그룹화해 현재 페이지가 속한 구간만 버튼으로 노출한다.
const renderPagination = function () {
  if (IS_HOME) {
    if (paginationRoot)
      paginationRoot.classList.add('pagination__button--hidden')
    return
  }

  if (!paginationList || !firstButton || !nextGroupButton) return

  if (totalPages === 0 || !totalPages) {
    paginationList.innerHTML = ''
    if (paginationRoot)
      paginationRoot.classList.add('pagination__button--hidden')
    return
  } else {
    if (paginationRoot)
      paginationRoot.classList.remove('pagination__button--hidden')
  }

  let htmlString = ''
  const currentGroup = Math.ceil(currentPage / pageCount)
  const totalGroup = Math.ceil(totalPages / pageCount)
  const startPage = (currentGroup - 1) * pageCount + 1
  const endPage = Math.min(startPage + pageCount - 1, totalPages)

  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === currentPage ? 'pagination__link--active' : ''
    htmlString += `
      <li class="pagination__item">
        <button type="button" class="pagination__button pagination__link ${activeClass}">${i}</button>
      </li>
    `
  }
  paginationList.innerHTML = htmlString

  firstButton.classList.toggle('pagination__button--hidden', currentGroup === 1)
  if (prevButton)
    prevButton.classList.toggle('pagination__button--hidden', currentPage === 1)
  if (nextButton)
    nextButton.classList.toggle(
      'pagination__button--hidden',
      currentPage === totalPages,
    )
  nextGroupButton.classList.toggle(
    'pagination__button--hidden',
    currentGroup === totalGroup,
  )

  // 새로 그린 페이지 번호 버튼에 현재 페이지 상태를 갱신하는 이벤트를 연결한다.
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchPosts()
    })
  })
}

// 목록 API는 FormData 기반 POST를 기대한다. 인증이 필요한 QnA 페이지에서는 사용자 확인 실패 시 요청을 중단한다.
async function fetchPosts() {
  try {
    // 홈 요약은 공개 영역이므로 로그인 검증 없이 목록만 요청한다.
    if (!IS_HOME) {
      const authenticatedUser = await fetchUserData(true)
      if (!authenticatedUser) return
    }

    const formData = new FormData()
    formData.append('board_id', 2)
    formData.append('page', IS_HOME ? 1 : currentPage)

    // 서버의 게시판 API는 게시글 작성자 PK인 UID를 user_id 필드로 받는다.
    if (userData && userData.UID) {
      formData.append('user_id', userData.UID)
    }

    // 빈 검색어도 같은 키로 보내 필터 요청 형태를 일정하게 유지한다.
    formData.append('search', currentSearch)
    if (!IS_HOME) {
      formData.append(
        'category',
        currentCategory === 'ALL' ? '' : currentCategory,
      )
    }

    const response = await fetch(`${BASE_URL}/board/list_board.php`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const responseData = await response.json()
    totalPages = responseData.total_pages
    const actualPosts = responseData.data || []
    const serverComments = []

    if (!Array.isArray(actualPosts) || actualPosts.length === 0) {
      renderPosts([])
      renderPagination()
      return
    }

    // 응답 순서가 바뀌어도 최신 글이 먼저 보이도록 클라이언트에서 한 번 더 정렬한다.
    actualPosts.sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )
    const qnaPosts = actualPosts.filter((item) => Number(item.board_id) === 2)

    // 댓글 API는 게시글별 배열을 반환하므로 병렬 요청 후 post_id 기준으로 묶어 카운트를 만든다.
    const commentsPromises = qnaPosts.map(async (post) => {
      try {
        const res = await fetch(
          `${BASE_URL}/comment/read.php?post_id=${post.post_id}`,
        )
        const result = await res.json()
        if (Array.isArray(result)) {
          result.forEach((cmt) =>
            serverComments.push({ ...cmt, post_id: post.post_id }),
          )
        }
      } catch (error) {
        console.error('댓글 로드 실패:', error)
      }
    })
    await Promise.all(commentsPromises)

    // 렌더러가 필요한 필드명과 길이에 맞춰 서버 응답을 화면 모델로 변환한다.
    const finalData = qnaPosts.map((post) => {
      const myComments = serverComments.filter(
        (comment) => String(comment.post_id) === String(post.post_id),
      )
      const cleanText = removeMarkdown(post.contents)
      const summary =
        cleanText.length > 500 ? cleanText.substring(0, 500) : cleanText

      return {
        ...post,
        user_nickname: post.user_nickname || post.nickname || '사용자',
        contents: summary,
        create_date: post.create_date ? String(post.create_date).trim() : '',
        commentCount: myComments.length,
      }
    })

    renderPosts(finalData)
    renderPagination()
  } catch (error) {
    console.error('에러 발생:', error)
    renderPosts([])
    renderPagination()
  }
}

// 사용자의 입력 이벤트를 상태 변경과 목록 재요청으로 연결한다.
function bindEvents() {
  // 검색어가 바뀌면 첫 페이지부터 다시 조회한다.
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.toLowerCase().trim()
      currentPage = 1
      fetchPosts()
    })
  }

  // 카테고리 버튼은 UI 활성 상태와 서버 필터 값을 함께 갱신한다.
  if (categoryButtons) {
    categoryButtons.forEach((category) => {
      category.addEventListener('click', () => {
        categoryButtons.forEach((btn) =>
          btn.classList.remove('category__button--active'),
        )
        category.classList.add('category__button--active')
        const targetIndex = Number(category.dataset.index)
        currentCategory =
          targetIndex === 0 ? 'ALL' : category.textContent.trim().toUpperCase()
        currentPage = 1
        fetchPosts()
      })
    })
  }

  // 페이지네이션은 목록 페이지에서만 동작하며, 버튼은 currentPage만 바꾸고 fetchPosts가 렌더링을 책임진다.
  if (!IS_HOME) {
    if (nextGroupButton) {
      nextGroupButton.addEventListener('click', () => {
        const currentGroup = Math.ceil(currentPage / pageCount)
        currentPage = Math.min(currentGroup * pageCount + 1, totalPages)
        fetchPosts()
      })
    }
    if (firstButton) {
      firstButton.addEventListener('click', () => {
        const currentGroup = Math.ceil(currentPage / pageCount)
        currentPage = Math.max(1, (currentGroup - 1) * pageCount)
        fetchPosts()
      })
    }
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--
          fetchPosts()
        }
      })
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++
          fetchPosts()
        }
      })
    }
  }

  // 카드 내부의 작성자 링크와 게시글 링크를 분리해 서로 다른 목적지로 이동시킨다.
  if (qnaPostUl) {
    qnaPostUl.addEventListener('click', (e) => {
      const authorEl = e.target.closest('.post__author-link')
      if (authorEl) {
        e.preventDefault()
        e.stopPropagation()
        const userId = authorEl.dataset.userId
        if (!userId) return
        location.href = (window.ROOT_PATH || './') + `src/pages/users/user_page/index.html?${userId}`
        return
      }

      e.preventDefault()
      const item = e.target.closest('.post__item')
      if (!item) return
      const postId = item.dataset.id
      localStorage.setItem('selectedPostId', postId)
      localStorage.setItem('selectedBoardId', 2)
      location.href = (window.ROOT_PATH || './') + 'src/pages/readpost/index.html'
    })
  }
}

// DOM 요소를 한 번 수집한 뒤 이벤트와 초기 데이터를 연결한다.
function start() {
  qnaPostUl = document.querySelector('.post__list')
  paginationList = document.querySelector('.pagination__list')
  firstButton = document.querySelector('.pagination__button--first')
  prevButton = document.querySelector('.pagination__button--prev')
  nextButton = document.querySelector('.pagination__button--next')
  nextGroupButton = document.querySelector('.pagination__button--next-group')
  searchInput = document.querySelector('#search__input')
  paginationRoot = document.querySelector('.pagination')
  categoryButtons = document.querySelectorAll('.category__button')

  bindEvents()
  fetchPosts()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start)
} else {
  start()
}
