let postData = []

let currentPage = 1
let currentDisplayData = postData
const itemsPerPage = 8
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
console.log(searchInput)

function timeForToday(value) {
  const today = new Date()
  const timeValue = new Date(value)
  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60,
  )
  if (betweenTime < 1) return '방금전'
  if (betweenTime < 60) return `${betweenTime}분전`
  const betweenTimeHour = Math.floor(betweenTime / 60)
  if (betweenTimeHour < 24) return `${betweenTimeHour}시간전`
  const betweenTimeDay = Math.floor(betweenTimeHour / 24)
  if (betweenTimeDay < 365) return `${betweenTimeDay}일전`
  return `${Math.floor(betweenTimeDay / 365)}년전`
}

function renderPosts(page, data) {
  if (data.length === 0) {
    postListElement.innerHTML = `
      <div class="main-post__no-result">
        <p>검색 결과가 없습니다.</p>
      </div>
    `
    return // 👈 데이터가 없으니 아래 로직은 실행하지 말고 여기서 끝내라는 뜻!
  }
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const sliceData = data.slice(startIndex, endIndex)

  postListElement.innerHTML = sliceData
    .map(
      // 리스트 클릭 -> 해당 글 읽기 페이지 연동 위해 data-id="${post.post_id}" (포스트 고유값) 추가
      (post) => `
   <li class="main-post__item" data-id="${post.post_id}">
  <a href="#" class="main-post__inner">
    <span class="main-post__tag">${post.type}</span>
    <div class="main-post__group">
      <h3 class="main-post__heading">${post.subject}</h3>
      <p class="main-post__text">${post.contents}</p>
    </div>
    
    <div class="main-post__meta-box">
    <span class="main-post__author-text">by <strong>${post.nickname}</strong></span>
        <span class="main-post__date">${timeForToday(post.create_date)}</span>
    </div>
  </a>
</li>
  `,
    )
    .join('')
}

function setupPaginationEvents(data) {
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      updateUI(data)
    })
  })
}

function renderPagination(data) {
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

function updateUI(data) {
  currentDisplayData = data
  renderPosts(currentPage, data)
  renderPagination(data)
}

nextButton.addEventListener('click', () => {
  const currentTotalPage = Math.ceil(currentDisplayData.length / itemsPerPage)
  if (currentPage < currentTotalPage) {
    currentPage++
    updateUI(currentDisplayData)
  }
})

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    updateUI(currentDisplayData)
  }
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

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase().trim()
  const postValue = postData.filter(({ subject }) =>
    subject.toLowerCase().includes(searchValue),
  )
  updateUI(postValue)
})

categoryButton.forEach((category) => {
  category.addEventListener('click', () => {
    const targetIndex = Number(category.dataset.index)
    categoryButton.forEach((btn) => btn.classList.remove('is-active'))
    category.classList.add('is-active')

    const filterData =
      targetIndex === 0
        ? postData
        : postData.filter(({ typeIndex }) => typeIndex === targetIndex)

    currentPage = 1
    updateUI(filterData)
  })
})

// updateUI(postData)
// 기존 더미데이터를 실제 작성한 글이 보이도록 교체

// 서버에서 글 목록 가져오기 (fetch)
// 자습방 글만 보이게 (filter)
// 화면이 이해하는 형태로 변환 (map)
// 화면에 뿌리기 (uadateUI(postData))
async function init() {
  try {
    const response = await fetch('http://localhost:4000/posts')
    if (!response.ok) throw new Error('데이터 불러오기 실패')

    // const serverPosts = await response.json()
    // 최신순 정렬
    const serverPosts = (await response.json()).sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )

    // 자습방 글만 필터
    const studyPosts = serverPosts.filter((item) => item.board_id === 1)

    postData = studyPosts.map((post) => ({
      post_id: post.post_id,
      board_id: post.board_id, // 게시판 임시값
      UID: post.UID, // 유저 아이디 임시값
      nickname: post.nickname || '사용자',
      subject: post.subject,
      contents: post.contents,
      type: post.type,
      typeIndex: post.typeIndex, // 카테고리 번호 필드
      create_date: post.create_date,
    }))

    updateUI(postData)
  } catch (error) {
    console.error(error)
    updateUI(postData)
  }
}

init()

// 클릭하면 글 읽기 페이지로 이동 (data-id="${post.post_id}")

postListElement.addEventListener('click', (e) => {
  // 템플릿 리터럴에 쓰인 a href = # 로 페이지 이동X -> preventDefault() 추가
  e.preventDefault()

  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)

  // 읽기 페이지 이동
  location.href = '../readpost/index.html'
})
