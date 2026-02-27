// ================================
// Import
// ================================
import { timeForToday } from '../../js/utils/date.js'
import { checkToken } from '../../api/JWT.js'
import { BASE_URL } from '../../api/api.js'
import { removeMarkdown } from '../../js/utils/removemarkdown.js'

// ================================
// 유저 인증
// ================================
let userData = null

async function fetchUserData(forceRefresh = false) {
  if (userData && !forceRefresh) return userData

  const fetchedData = await checkToken()
  if (fetchedData) {
    userData = fetchedData
    return userData
  } else {
    alert('유효하지 않은 접근입니다.')
    window.location.href = '/index.html'
    return
  }
}

// ================================
// 상태 변수
// ================================
let currentPage = 1
let currentSearch = ''
let currentCategory = 'ALL'
let totalPages = 1
const pageCount = 5

// ================================
// DOM 요소
// ================================
const postListElement = document.querySelector('.post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__button--first')
const prevButton = document.querySelector('.pagination__button--prev')
const nextButton = document.querySelector('.pagination__button--next')
const nextGroupButton = document.querySelector(
  '.pagination__button--next-group',
)
const categoryButton = document.querySelectorAll('.category__button')
const searchInput = document.getElementById('search__input')

// ================================
// 게시글 데이터 fetch
// ================================
async function fetchPosts() {
  try {
    // 로그인 검증
    await fetchUserData(true)

    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('board_id', 1)
    formData.append('page', currentPage)
    formData.append('user_id', userData.UID)
    formData.append('search', currentSearch)
    formData.append(
      'category',
      currentCategory === 'ALL' ? '' : currentCategory,
    )

    const response = await fetch(`${BASE_URL}/board/list_board.php`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const result = await response.json()
    totalPages = result.total_pages || 0

    if (!result.data || result.data.length === 0) {
      renderPosts([])
      renderPagination()
      return
    }

    // 데이터 가공
    const actualPosts = result.data.map((post) => {
      const categories = Array.isArray(post.type) ? post.type : [post.type]
      const cleanText = removeMarkdown(post.contents)
      const summary =
        cleanText.length > 500 ? cleanText.substring(0, 500) : cleanText

      return {
        ...post,
        nickname: post.user_nickname || '사용자',
        type: categories,
        contents: summary,
      }
    })

    renderPosts(actualPosts)
    renderPagination()
  } catch (error) {
    console.error('에러 발생:', error)
    renderPosts([])
    renderPagination()
  }
}

// ================================
// 게시글 렌더링
// ================================
function renderPosts(data) {
  if (data.length === 0) {
    postListElement.innerHTML = `
      <div class="post__no-result">
        <p>검색 결과가 없습니다.</p>
      </div>
    `
    return
  }

  postListElement.innerHTML = data
    .map(
      (post) => `
        <li class="post__item" data-id="${post.post_id}">
          <a href="#" class="post__inner">
            <div class="post__top-row">
              <span class="post__tag">${Array.isArray(post.type) ? post.type[0] : post.type}</span>
              <span class="post__date">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.00016 14.6668C11.6821 14.6668 14.6668 11.6821 14.6668 8.00016C14.6668 4.31826 11.6821 1.3335 8.00016 1.3335C4.31826 1.3335 1.3335 4.31826 1.3335 8.00016C1.3335 11.6821 4.31826 14.6668 8.00016 14.6668Z" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 4V8L10.6667 9.33333" stroke="#6A7282" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${timeForToday(post.create_date)}
              </span>
            </div>
            <div class="post__group">
              <h3 class="post__heading">${post.subject}</h3>
              <p class="post__text">${post.contents}</p>
            </div>
          </a>
        </li>
      `,
    )
    .join('')
}

// ================================
// 페이지네이션 렌더링
// ================================
function renderPagination() {
  const paginationWrapper = document.querySelector('.pagination')

  if (totalPages <= 0) {
    paginationList.innerHTML = ''
    if (paginationWrapper) paginationWrapper.style.display = 'none'
    return
  } else {
    if (paginationWrapper) paginationWrapper.style.display = 'flex'
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

  const hiddenClass = 'pagination__button--hidden'
  if (firstButton) firstButton.classList.toggle(hiddenClass, currentGroup === 1)
  if (nextGroupButton)
    nextGroupButton.classList.toggle(
      hiddenClass,
      currentGroup === totalGroup || totalPages === 0,
    )
  if (prevButton) prevButton.classList.toggle(hiddenClass, currentPage === 1)
  if (nextButton)
    nextButton.classList.toggle(hiddenClass, currentPage === totalPages)

  // 페이지 번호 버튼 클릭 이벤트
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchPosts()
    })
  })
}

// ================================
// 이벤트 바인딩
// ================================

// 페이지네이션 버튼
nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++
    fetchPosts()
  }
})
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    fetchPosts()
  }
})
nextGroupButton.addEventListener('click', () => {
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = Math.min(currentGroup * pageCount + 1, totalPages)
  fetchPosts()
})
firstButton.addEventListener('click', () => {
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = (currentGroup - 1) * pageCount
  fetchPosts()
})

// 검색
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.toLowerCase().trim()
  currentPage = 1
  fetchPosts()
})

// 카테고리
categoryButton.forEach((category) => {
  category.addEventListener('click', () => {
    categoryButton.forEach((btn) =>
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

// 게시글 클릭 -> 상세 페이지 이동
fetchPosts()

postListElement.addEventListener('click', (e) => {
  e.preventDefault()
  const item = e.target.closest('.post__item')
  if (!item) return
  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 1)
  location.href = '../readpost/index.html'
})
