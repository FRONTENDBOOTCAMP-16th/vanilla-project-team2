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

// const timeForToday = function (value) {
//   const today = new Date()
//   const timeValue = new Date(value)
//   const betweenTime = Math.floor(
//     (today.getTime() - timeValue.getTime()) / 1000 / 60,
//   )

//   if (betweenTime < 1) return '방금전'
//   if (betweenTime < 60) return `${betweenTime}분전`
//   const betweenTimeHour = Math.floor(betweenTime / 60)
//   if (betweenTimeHour < 24) return `${betweenTimeHour}시간전`
//   const betweenTimeDay = Math.floor(betweenTimeHour / 24)
//   if (betweenTimeDay < 365) return `${betweenTimeDay}일전`
//   return `${Math.floor(betweenTimeDay / 365)}년전`
// }
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

updateUI(qnaData)

// 서버 연결
async function init() {
  try {
    const [postResponse, commentResponse] = await Promise.all([
      fetch('http://localhost:4000/posts'),
      fetch('http://localhost:4000/comments'), // 👈 댓글 뭉치도 주세요!
    ])
    if (!postResponse.ok || !commentResponse.ok)
      throw new Error('데이터 불러오기 실패')

    // const serverPosts = await response.json()
    // 최신순 정렬
    const serverPosts = await postResponse.json()
    const serverComments = await commentResponse.json()
    serverPosts.sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )
    // 자습방 글만 필터
    const qnaPosts = serverPosts.filter((item) => item.board_id === 2)

    qnaData = qnaPosts.map((post) => {
      // 내 글 번호(post.post_id)와 똑같은 post_id를 가진 댓글들만 골라냅니다
      // (형님이 보내주신 사진의 'post_id' 변수명을 여기서 씁니다!)
      const myComments = serverComments.filter(
        (comment) => String(comment.post_id) === String(post.post_id),
      )

      return {
        post_id: post.post_id,
        board_id: post.board_id,
        UID: post.UID,
        nickname: post.nickname || '사용자',
        subject: post.subject,
        contents: post.contents,
        type: post.type,
        typeIndex: post.typeIndex,
        create_date: post.create_date,
        commentCount: myComments.length,
      }
    })
    // console.log('최종 데이터', qnaData)
    updateUI(qnaData)
  } catch (error) {
    console.error(error)
    updateUI(qnaData)
  }
}

init()

qnaPostUl.addEventListener('click', (e) => {
  // 템플릿 리터럴에 쓰인 a href = # 로 페이지 이동X -> preventDefault() 추가
  e.preventDefault()

  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
    localStorage.setItem('selectedBoardId', 2)

  // 읽기 페이지 이동
  location.href = '../readpost/index.html'
})
