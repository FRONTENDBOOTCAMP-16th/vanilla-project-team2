import { checkToken } from '../../../api/JWT.js'

const userPageURL = ''
const queryString = window.location.search; // "?1"
const param = queryString.substring(1); // 첫 번째 글자(?)를 제외하고 추출
console.log(param); // "1"

// 로그인 상태 검증
async function fetchUserData(forceRefresh = false) {
  const fetchedData = await checkToken()
  if (fetchedData) {
    return true
  } else {
    alert('유효하지 않은 접근입니다.')
    window.location.href = '/index.html'
    return false
  }
}

async function renderUserPage(param) {
  try {
    const response = await fetch(`http://leedh9276.dothome.co.kr/likelion-vanilla/users/read_user.php?user_uid=${param}`, {
      method: 'GET',
    })

    const data = await response.json()
    console.log(data)

  const USER_NICKNAME = document.querySelector('.user')
  const USER_CREATE_DATE = document.querySelector('.create-date span')
  const USER_PROFILE = document.querySelector('.profile_thumb')
  const USER_GRADE = document.querySelector('.expert')
  const USER_INTRO = document.querySelector('#user_intro')
  const USER_POST_COUNT = document.querySelector('.write .write__count')
  const USER_COMMENT_COUNT = document.querySelector('.comment .write__count')
    
  USER_NICKNAME.textContent = data.user_nickname
  USER_CREATE_DATE.textContent = data.create_date.split(' ')[0]


    // 프로필 이미지
    if (data.user_profile) {
      USER_PROFILE.innerHTML = `<img src="http://leedh9276.dothome.co.kr/likelion-vanilla/users/uploads/profile/${data.user_profile}">`
    } else {
      const thumbName = data.user_nickname.substring(0, 1)
      USER_PROFILE.innerHTML = `<p>${thumbName}</p>`
    }

    // 회원의 등급
    const grades = ['초급 개발자', '중급 개발자', '고급 개발자']
    USER_GRADE.textContent = grades[data.user_grade] ?? '???'
    USER_INTRO.textContent = data.user_intro
    USER_POST_COUNT.textContent = data.post_count
    USER_COMMENT_COUNT.textContent = data.comment_count


  }
  catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error)
  }
}


async function initPage() {
  await fetchUserData() // 데이터 1번 요청
  renderUserPage(param)
}

initPage()
