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

function removeMarkdown(text) {
  if (!text) return ''

  return (
    text
      // 1. 코드 블록(```...```) 전체 삭제
      .replace(/```[\s\S]*?```/g, '')
      // 2. 인라인 코드(`...`) 전체 삭제
      .replace(/`.*?`/g, '')
      // 3. 마크다운 기호들 제거 (ESLint 가이드에 맞춰 역슬래시 정리)
      // 대괄호 안에서 ^, -, \ 를 제외한 대부분의 기호는 역슬래시가 필요 없습니다.
      .replace(/[#*_\-~[\]()>]/g, '')
      // 4. 공백 정리
      .replace(/\s+/g, ' ')
      .trim()
  )
}

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
      const cleanContents = removeMarkdown(post.contents)

      // 💡 목록용 요약문은 너무 길면 안 되니 적당히 자릅니다 (예: 100자)
      const summary =
        cleanContents.length > 100
          ? cleanContents.substring(0, 100) + '...'
          : cleanContents
      return {
        post_id: post.post_id,
        board_id: post.board_id,
        user_id: post.user_id,
        user_nickname: post.user_nickname || post.nickname || '사용자',
        subject: post.subject,
        contents: summary,
        type: post.type,
        create_date: post.create_date ? post.create_date.trim() : '',
        commentCount: commentsCounts[index],
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
