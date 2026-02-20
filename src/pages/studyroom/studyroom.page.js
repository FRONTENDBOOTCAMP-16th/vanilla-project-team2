let postData = []

let currentPage = 1
let currentDisplayData = postData
const itemsPerPage = 8
const pageCount = 5

// 💡 여기서 선언한 이름(postListElement)을 맨 밑 클릭 이벤트에서도 똑같이 써야 합니다!
const postListElement = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector('.pagination__control--next-group')
const categoryButton = document.querySelectorAll('.main-category__button')
const searchInput = document.getElementById('main-search__item')

function timeForToday(value) {
  const today = new Date()
  const timeValue = new Date(value)
  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60)
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
    return 
  }
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const sliceData = data.slice(startIndex, endIndex)

  postListElement.innerHTML = sliceData
    .map(
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
  `
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
  nextGroupButton.classList.toggle('hidden', currentGroup === totalGroup || currentTotalPage === 0)

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
  currentPage = 1
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

async function init() {
  try {
    const postResponse = await fetch('http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=1&page=1');
    
    if (!postResponse.ok) {
      throw new Error('데이터 불러오기 실패');
    }

    const serverPosts = await postResponse.json();
    console.log('서버에서 온 데이터:', serverPosts);

    if (!Array.isArray(serverPosts)) {
      console.log('게시글이 없거나 데이터 형식이 다릅니다. 빈 화면을 띄웁니다.');
      updateUI([]); 
      return; 
    }
    
    serverPosts.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
    
    // 💡 자습방 데이터로 필터링!
    const studyPosts = serverPosts.filter((item) => Number(item.board_id) === 1);

    postData = studyPosts.map((post) => {

      return {
        post_id: post.post_id,
        board_id: post.board_id,
        user_id: post.user_id,         
        nickname: post.user_nickname || '사용자', 
        subject: post.subject,
        contents: post.contents,
        type: post.type,
        typeIndex: post.typeIndex,
        create_date: post.create_date,
      };
    });
    
    updateUI(postData);

  } catch (error) {
    console.error('에러 발생:', error);
    updateUI([]); 
  }
}

init();

// ---------------------------------------------------------
// 🚨 버그 수정: qnaPostUl -> postListElement 로 변경 완료!
postListElement.addEventListener('click', (e) => {
  e.preventDefault();

  const item = e.target.closest('.main-post__item');
  if (!item) return;

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 1)

  location.href = '../readpost/index.html';
});