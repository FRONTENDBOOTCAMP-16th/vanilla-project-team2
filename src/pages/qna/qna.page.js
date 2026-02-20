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
    // 1. 게시글 데이터만 먼저 확실하게 가져옵니다. (page=1로 수정했습니다!)
    const postResponse = await fetch('http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=2&page=1');
    
    if (!postResponse.ok) {
      throw new Error('데이터 불러오기 실패');
    }

    const serverPosts = await postResponse.json();
    console.log('서버에서 온 데이터:', serverPosts);

    // 2. 🚨 핵심 방어막: 서버가 배열 안 주고 "게시글이 없습니다." 줬을 때 터지는 것 방지
    if (!Array.isArray(serverPosts)) {
      console.log('게시글이 없거나 데이터 형식이 다릅니다. 빈 화면을 띄웁니다.');
      updateUI([]); 
      return; // 여기서 함수를 멈춥니다! (밑으로 내려가서 sort, filter 터지는 걸 막음)
    }
    
    // 3. 최신순 정렬 (데이터가 배열일 때만 무사히 실행됨)
    serverPosts.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
    
    // 4. 자습방 글만 필터 (board_id가 2인 것만)
    const qnaPosts = serverPosts.filter((item) => Number(item.board_id) === 2);

    // 5. 화면에 그리기 좋게 데이터 가공
    qnaData = qnaPosts.map((post) => {
      // 🚧 댓글 기능은 백엔드 주소 확정 전까지 임시로 꺼둡니다.
      // const myComments = serverComments.filter(comment => String(comment.post_id) === String(post.post_id));
      const myComments = []; // 일단 빈 배열로 처리해서 에러 방지

      return {
        post_id: post.post_id,
        board_id: post.board_id,
        user_id: post.user_id,         // 백엔드 명세서에 맞춤 (UID -> user_id)
        nickname: post.user_nickname || '사용자', // 백엔드 명세서에 맞춤 (nickname -> user_nickname)
        subject: post.subject,
        contents: post.contents,
        type: post.type,
        create_date: post.create_date,
        commentCount: myComments.length, // 당분간 무조건 0으로 표시됨
      };
    });
    
    // 최종 데이터로 화면 업데이트
    updateUI(qnaData);

  } catch (error) {
    console.error('에러 발생:', error);
    updateUI([]); // 네트워크 에러 나도 화면이 하얗게 멈추지 않도록 빈 화면 처리
  }
}

// 최초 실행
init();

// ---------------------------------------------------------
// 형님이 짜신 클릭 이벤트 (완벽해서 건드릴 게 없습니다!)
qnaPostUl.addEventListener('click', (e) => {
  // 템플릿 리터럴에 쓰인 a href = # 로 페이지 이동X -> preventDefault() 추가
  e.preventDefault();

  const item = e.target.closest('.main-post__item');
  if (!item) return;

  const postId = item.dataset.id;
  localStorage.setItem('selectedPostId', postId);

  // 읽기 페이지 이동
  location.href = '../readpost/index.html';
});
