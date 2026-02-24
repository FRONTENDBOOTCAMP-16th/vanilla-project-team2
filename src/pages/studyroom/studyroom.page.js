import { timeForToday } from '../../js/utils/date.js'

let currentPage = 1
let currentSearch = ''
let currentCategory = 'ALL'
let totalPages = 1

const pageCount = 5

const postListElement = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector(
  '.pagination__control--next-group',
)
const categoryButton = document.querySelectorAll('.main-category__button')
const searchInput = document.getElementById('main-search__item')

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
    const url = `http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=1&page=${currentPage}&search=${currentSearch}&category=${currentCategory === 'ALL' ? '' : currentCategory}`

    const response = await fetch(url)
    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const result = await response.json()
    totalPages = result.total_pages || 1

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

function renderPosts(data) {
  if (data.length === 0) {
    postListElement.innerHTML = `
      <div class="main-post__no-result">
        <p>검색 결과가 없습니다.</p>
      </div>
    `
    return
  }

  postListElement.innerHTML = data
    .map(
      (post) => `
    <li class="main-post__item" data-id="${post.post_id}">
      <a href="#" class="main-post__inner">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="main-post__tag">${Array.isArray(post.type) ? post.type[0] : post.type}</span>
          <span class="main-post__date">${timeForToday(post.create_date)}</span>
        </div>

        <div class="main-post__group">
          <h3 class="main-post__heading">${post.subject}</h3>
          <p class="main-post__text">${post.contents}</p>
        </div>

        <div class="main-post__meta-box">
          <span class="main-post__author-text" style="margin-left: auto;">by <strong>${post.nickname}</strong></span>
        </div>

      </a>
    </li>
  `,
    )
    .join('')
}

// 페이지 네이션

function renderPagination() {
  let htmlString = ''
  const currentGroup = Math.ceil(currentPage / pageCount)
  const totalGroup = Math.ceil(totalPages / pageCount)

  let startPage = (currentGroup - 1) * pageCount + 1
  let endPage = Math.min(startPage + pageCount - 1, totalPages)

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
    currentGroup === totalGroup || totalPages === 0,
  )

  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchPosts()
    })
  })
}

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
    categoryButton.forEach((btn) => btn.classList.remove('is-active'))
    category.classList.add('is-active')

    const targetIndex = Number(category.dataset.index)
    currentCategory =
      targetIndex === 0 ? 'ALL' : category.textContent.trim().toUpperCase()

    currentPage = 1
    fetchPosts()
  })
})

fetchPosts()

// 게시글로 넘어가기

postListElement.addEventListener('click', (e) => {
  e.preventDefault()
  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 1)
  location.href = '../readpost/index.html'
})
