import { postItem } from '../../js/components/postItem.js'

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

function removeMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/[#*_\-~[\]()>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const renderPosts = function (data) {
  if (!qnaPostUl) return

  if (!data || data.length === 0) {
    qnaPostUl.innerHTML = `
      <li class="post__no-result">
        <p>검색 결과가 없습니다.</p>
      </li>
    `
    return
  }

  const displayData = IS_HOME ? data.slice(0, ITEMS_PER_PAGE) : data
  qnaPostUl.innerHTML = displayData.map((post) => postItem(post)).join('')
}

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

  if (prevButton) {
    prevButton.classList.toggle('pagination__button--hidden', currentPage === 1)
  }

  if (nextButton) {
    nextButton.classList.toggle(
      'pagination__button--hidden',
      currentPage === totalPages,
    )
  }

  nextGroupButton.classList.toggle(
    'pagination__button--hidden',
    currentGroup === totalGroup,
  )

  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchPosts()
    })
  })
}

async function fetchPosts() {
  try {
    const url = IS_HOME
      ? `http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=2&page=1`
      : `http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=2&page=${currentPage}&search=${currentSearch}&category=${currentCategory === 'ALL' ? '' : currentCategory}`

    const response = await fetch(url)
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

    actualPosts.sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )
    const qnaPosts = actualPosts.filter((item) => Number(item.board_id) === 2)

    const commentsPromises = qnaPosts.map(async (post) => {
      try {
        const res = await fetch(
          `http://leedh9276.dothome.co.kr/likelion-vanilla/comment/read.php?post_id=${post.post_id}`,
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

function bindEvents() {
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.toLowerCase().trim()
      currentPage = 1
      fetchPosts()
    })
  }

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

  if (qnaPostUl) {
    qnaPostUl.addEventListener('click', (e) => {
      e.preventDefault()
      const item = e.target.closest('.post__item')
      if (!item) return
      const postId = item.dataset.id
      localStorage.setItem('selectedPostId', postId)
      localStorage.setItem('selectedBoardId', 2)
      location.href = '/src/pages/readpost/index.html'
    })
  }
}

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
