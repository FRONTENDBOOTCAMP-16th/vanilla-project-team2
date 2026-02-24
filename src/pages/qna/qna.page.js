import { postItem } from '../../js/components/postItem.js'

let qnaData = []

// 💡 윗부분 수정: 스터디룸처럼 전체 페이지 수(totalPages)를 서버에서 받아옵니다!
let currentPage = 1
let totalPages = 1
const pageCount = 5

const qnaPostUl = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector(
  '.pagination__control--next-group',
)
const searchInput = document.querySelector('#main-search__item')

// 💡 [수정] slice 로직 완전 제거. 서버가 딱 맞게 자른 걸 그대로 보여줍니다.
const renderPosts = function (data) {
  if (data.length === 0) {
    qnaPostUl.innerHTML = `
    <li class="main-post__no-result">
      <p>검색 결과가 없습니다.</p>
    </li>
    `
    return
  }
  const qnaElementList = data.map((post) => postItem(post)).join('')
  qnaPostUl.innerHTML = qnaElementList
}

// 💡 [수정] data.length 대신 서버가 준 totalPages를 사용해 버튼을 만듭니다.
const renderPagination = function () {
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
  pageButtons.forEach((Btn) => {
    Btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchQnaPosts() // 💡 버튼 누르면 서버에 새 페이지 요청!
    })
  })
}

// 💡 페이지 이동 버튼들도 updateUI 대신 fetchQnaPosts(서버 요청)로 변경
nextGroupButton.addEventListener('click', () => {
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = Math.min(currentGroup * pageCount + 1, totalPages)
  fetchQnaPosts()
})

firstButton.addEventListener('click', () => {
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = (currentGroup - 1) * pageCount
  fetchQnaPosts()
})

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    fetchQnaPosts()
  }
})

nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++
    fetchQnaPosts()
  }
})

// 마크다운 제거 전용 함수
function removeMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/[#*_\-~[\]()>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// 💡 init 함수를 fetchQnaPosts로 변경 (재사용 목적)
async function fetchQnaPosts() {
  try {
    // 💡 URL에 page=${currentPage} 동적 적용!
    const response = await fetch(
      `http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=2&page=${currentPage}`,
    )

    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const responseData = await response.json()
    const actualPosts = responseData.data
    const serverComments = []

    // 💡 핵심: 스터디룸처럼 서버에서 알려주는 전체 페이지 수 저장!
    totalPages = responseData.total_pages || 1

    if (!Array.isArray(actualPosts)) {
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
      } catch (e) {}
    })
    await Promise.all(commentsPromises)

    qnaData = qnaPosts.map((post) => {
      const myComments = serverComments.filter(
        (comment) => String(comment.post_id) === String(post.post_id),
      )

      const cleanText = removeMarkdown(post.contents)
      const summary =
        cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText

      return {
        post_id: post.post_id,
        board_id: post.board_id,
        user_id: post.user_id,
        user_nickname: post.user_nickname || post.nickname || '사용자',
        subject: post.subject,
        contents: summary,
        type: post.type,
        create_date: post.create_date ? post.create_date.trim() : '',
        commentCount: myComments.length,
      }
    })

    // 💡 데이터 가공이 다 끝나면 화면에 그립니다
    renderPosts(qnaData)
    renderPagination()
  } catch (error) {
    console.error('에러 발생:', error)
    renderPosts([])
    renderPagination()
  }
}

// 검색 기능 로직
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase().trim()
  const searchedData = qnaData.filter(({ subject }) =>
    subject.toLowerCase().includes(keyword),
  )
  renderPosts(searchedData)
})

// 최초 실행!
fetchQnaPosts()

qnaPostUl.addEventListener('click', (e) => {
  e.preventDefault()
  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 2)
  location.href = '../readpost/index.html'
})
