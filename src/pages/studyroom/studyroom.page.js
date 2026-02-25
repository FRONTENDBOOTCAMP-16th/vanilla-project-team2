import { timeForToday } from '../../js/utils/date.js'

let currentPage = 1
let currentSearch = ''
let currentCategory = 'ALL'
let totalPages = 1

const pageCount = 5

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
    const url = `http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=1&page=${currentPage}&search=${currentSearch}&category=${currentCategory === 'ALL' ? '' : currentCategory}`

    const response = await fetch(url)
    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const result = await response.json()
    totalPages = result.total_pages

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

  if (totalPages === 0) {
    paginationList.innerHTML = ''
    if (firstButton) firstButton.classList.add('pagination__button--hidden')
    if (prevButton) prevButton.classList.add('pagination__button--hidden')
    if (nextButton) nextButton.classList.add('pagination__button--hidden')
    if (nextGroupButton)
      nextGroupButton.classList.add('pagination__button--hidden')
    return
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
  nextGroupButton.classList.toggle(
    'pagination__button--hidden',
    currentGroup === totalGroup || totalPages === 0,
  )
  if (prevButton)
    prevButton.classList.toggle('pagination__button--hidden', currentPage === 1)
  if (nextButton)
    nextButton.classList.toggle(
      'pagination__button--hidden',
      currentPage === totalPages,
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
