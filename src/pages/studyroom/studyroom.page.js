import { timeForToday } from '../../js/utils/date.js'
import { checkToken } from '../../api/JWT.js'

// 아예 빈값으로 변수선언
let userData = null

// 서버에서 검증하도록 비동기 함수를 생선
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

let currentPage = 1
let currentSearch = ''
let currentCategory = 'ALL'
let totalPages = 1
const pageCount = 5

// 클래스명은 형님이 바꾸신 그대로 유지한다고 하셨으니, 변수명과 매칭만 잘 되어있는지 확인하세요!
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

function removeMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/[#*_\-~[\]()>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchPosts() {
  try {
    // 일단 유저 데이터를 받아올태니, 함수실행을 잠깐 멈춰라.
    await fetchUserData(true)

    // 위의 함수가 실행되면 토큰 안에 있는 정보를 뱉어라
    console.log(userData)

    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('board_id', 1)
    formData.append('page', currentPage)
    formData.append('user_id', userData.UID) // 👈 user_id 대신 UID로 키값을 바꿔서 전송
    formData.append('search', currentSearch)
    formData.append(
      'category',
      currentCategory === 'ALL' ? '' : currentCategory,
    )

    const response = await fetch(
      'http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php',
      {
        method: 'POST',
        headers: {
          // 💡 JWT 방식은 보통 Authorization 헤더에 Bearer 토큰을 실어 보냅니다.
          Authorization: `Bearer ${token}`,
        },
        body: formData, // POST 방식이므로 body에 담아 보냄
      },
    )

    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const result = await response.json()
    console.log('서버 응답 결과:', result) // 👈 여기서 데이터가 오는지 꼭 확인!
    console.log(localStorage)

    totalPages = result.total_pages || 0

    // 데이터가 없으면 검색 결과 없음 띄우고 종료
    if (!result.data || result.data.length === 0) {
      renderPosts([])
      renderPagination()
      return
    }

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

// -------------------------------------------------------------------
// 렌더링 및 페이지네이션 함수들 (형님 코드 로직 유지)
// -------------------------------------------------------------------

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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="post__tag">${Array.isArray(post.type) ? post.type[0] : post.type}</span>
              <span class="post__date">${timeForToday(post.create_date)}</span>
            </div>
            <div class="post__group">
              <h3 class="post__heading">${post.subject}</h3>
              <p class="post__text">${post.contents}</p>
            </div>
            <div class="post__meta-box">
              <span class="post__author-text" style="margin-left: auto;">by <strong>${post.nickname}</strong></span>
            </div>
          </a>
        </li>
      `,
    )
    .join('')
}

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

  // 버튼 숨기기 로직
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

  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchPosts()
    })
  })
}

// 이벤트 리스너 설정
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

searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.toLowerCase().trim()
  currentPage = 1
  fetchPosts()
})

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
