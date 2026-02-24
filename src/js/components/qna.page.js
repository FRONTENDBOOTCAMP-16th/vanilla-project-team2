import { postItem } from '../../js/components/postItem.js'

let qnaData = []

const itemsPerPage = 8
const pageCount = 5
let currentPage = 1
let currentDisplayData = qnaData

const qnaPostUl = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector(
  '.pagination__control--next-group',
)
const searchInput = document.querySelector('#main-search__item')

const renderPosts = function (page, data) {
  if (data.length === 0) {
    qnaPostUl.innerHTML = `
    <li class="main-post__no-result">
      <p>검색 결과가 없습니다.</p>
    </li>
    `
    return
  }

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const sliceData = data.slice(startIndex, endIndex)

  const qnaElementList = sliceData.map((post) => postItem(post)).join('')
  qnaPostUl.innerHTML = qnaElementList
}

const setupPaginationEvents = function (data) {
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((Btn) => {
    Btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      updateUI(data)
    })
  })
}

const renderPagination = function (data) {
  let htmlString = ''
  const currentTotalPage = Math.ceil(data.length / itemsPerPage)
  const currentGroup = Math.ceil(currentPage / pageCount)
  const totalGroup = Math.ceil(currentTotalPage / pageCount)

  let startPage = (currentGroup - 1) * pageCount + 1
  let endPage = Math.min(startPage + pageCount - 1, currentTotalPage)

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

const updateUI = function (data) {
  currentDisplayData = data
  renderPosts(currentPage, currentDisplayData)
  renderPagination(data)
}

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase().trim()
  const searchedData = qnaData.filter(({ subject }) =>
    subject.toLowerCase().includes(keyword),
  )
  currentPage = 1
  updateUI(searchedData)
})

nextGroupButton.addEventListener('click', () => {
  const currentTotalPage = Math.ceil(currentDisplayData.length / itemsPerPage)
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = Math.min(currentGroup * pageCount + 1, currentTotalPage)
  updateUI(currentDisplayData)
})

firstButton.addEventListener('click', () => {
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = (currentGroup - 1) * pageCount
  updateUI(currentDisplayData)
})

prevButton.addEventListener('click', () => {
  currentPage = Math.max(currentPage - 1, 1)
  updateUI(currentDisplayData)
})

nextButton.addEventListener('click', () => {
  const currentTotalPage = Math.ceil(currentDisplayData.length / itemsPerPage)
  currentPage = Math.min(currentPage + 1, currentTotalPage)
  updateUI(currentDisplayData)
})

async function init() {
  try {
    const [postResponse] = await Promise.all([
      fetch(
        'http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=2&page=1',
      ),
    ])

    if (!postResponse.ok) throw new Error('데이터 불러오기 실패')

    const responseData = await postResponse.json()
    const actualPosts = responseData.data
    const serverComments = []

    if (!Array.isArray(actualPosts)) {
      updateUI([])
      return
    }

    actualPosts.sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )
    const qnaPosts = actualPosts.filter((item) => Number(item.board_id) === 2)

    qnaData = qnaPosts.map((post) => {
      const myComments = serverComments.filter(
        (comment) => String(comment.post_id) === String(post.post_id),
      )

      return {
        post_id: post.post_id,
        board_id: post.board_id,
        user_id: post.user_id,
        // 💡 해결 1: postItem에서 user_nickname을 쓰니까 이름을 맞춰줘야 합니다.
        user_nickname: post.user_nickname || post.nickname || '사용자',
        subject: post.subject,
        contents: post.contents,
        type: post.type,
        // 💡 해결 2: 날짜 데이터가 깨끗한지 확인 (앞뒤 공백 제거)
        create_date: post.create_date ? post.create_date.trim() : '',
        commentCount: myComments.length,
      }
    })

    updateUI(qnaData)
  } catch (error) {
    console.error('에러 발생:', error)
    updateUI([])
  }
}

init()

qnaPostUl.addEventListener('click', (e) => {
  e.preventDefault()
  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 2)
  location.href = '../readpost/index.html'
})
