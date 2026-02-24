import { timeForToday } from '../../js/utils/date.js'

// 상태 관리 변수들 (이제 postData 전체를 저장할 필요 없음)
let currentPage = 1;
let currentSearch = '';
let currentCategory = 'ALL';
let totalPages = 1; // 서버에서 받아올 총 페이지 수

const itemsPerPage = 8;
const pageCount = 5;

// DOM 요소 선택 (기존과 동일)
const postListElement = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector('.pagination__control--next-group')
const categoryButton = document.querySelectorAll('.main-category__button')
const searchInput = document.getElementById('main-search__item')

// [핵심] 서버에서 데이터를 가져오는 함수
async function fetchPosts() {
  try {
    // 1. 상태 변수를 URL 파라미터로 만듭니다.
    const url = `http://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=1&page=${currentPage}&search=${currentSearch}&category=${currentCategory === 'ALL' ? '' : currentCategory}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('데이터 불러오기 실패');

    const result = await response.json();
    
    // 2. 서버에서 준 데이터로 UI 업데이트
    totalPages = result.total_pages || 1; 
    
    const actualPosts = result.data.map((post) => {
      // JSON 파싱이나 배열 처리가 필요하다면 여기서 정리
      const categories = Array.isArray(post.type) ? post.type : [post.type]
      return {
        ...post,
        nickname: post.user_nickname || '사용자',
        type: categories,
      }
    });

    renderPosts(actualPosts);
    renderPagination();

  } catch (error) {
    console.error('에러 발생:', error);
    renderPosts([]);
    renderPagination();
  }
}

// 포스트 렌더링 (slice 제거됨 - 서버가 이미 잘라서 줌)
function renderPosts(data) {
  if (data.length === 0) {
    postListElement.innerHTML = `
      <div class="main-post__no-result">
        <p>검색 결과가 없습니다.</p>
      </div>
    `
    return
  }

  postListElement.innerHTML = data.map(post => `
    <li class="main-post__item" data-id="${post.post_id}">
      <a href="#" class="main-post__inner">
        <span class="main-post__tag">${Array.isArray(post.type) ? post.type[0] : post.type}</span>
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
  `).join('');
}

// 페이지네이션 렌더링 (서버에서 받은 totalPages 사용)
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

  // 버튼 활성/비활성 처리
  firstButton.classList.toggle('hidden', currentGroup === 1)
  nextGroupButton.classList.toggle('hidden', currentGroup === totalGroup || totalPages === 0)

  // 페이지 번호 클릭 이벤트 다시 달기
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      fetchPosts() // 상태 변경 후 데이터 새로 요청
    })
  })
}

// --- 이벤트 리스너들 ---

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

// 검색 (디바운싱 생략, 바로 적용)
searchInput.addEventListener('change', () => {
  currentSearch = searchInput.value.toLowerCase().trim()
  currentPage = 1 // 검색 시 1페이지로 리셋
  fetchPosts()
})

// 카테고리 필터
categoryButton.forEach((category) => {
  category.addEventListener('click', () => {
    categoryButton.forEach((btn) => btn.classList.remove('is-active'))
    category.classList.add('is-active')

    const targetIndex = Number(category.dataset.index)
    currentCategory = targetIndex === 0 ? 'ALL' : category.textContent.trim().toUpperCase()
    
    currentPage = 1 // 카테고리 변경 시 1페이지로 리셋
    fetchPosts()
  })
})

// 최초 실행
fetchPosts()

// 게시글 클릭 (기존과 동일)
postListElement.addEventListener('click', (e) => {
  e.preventDefault()
  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 1)
  location.href = '../readpost/index.html'
})