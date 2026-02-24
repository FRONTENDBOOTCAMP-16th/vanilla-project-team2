import { checkToken } from '../../../api/JWT.js'
const URLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/update_user.php'

let userData = null

async function fetchUserData(forceRefresh = false) {
  if (userData && !forceRefresh) return userData

  const fetchedData = await checkToken()
  if (fetchedData) {
    userData = fetchedData
    return userData
  } else {
    alert('유효하지 않은 접근입니다.')
    window.location.href = '/src/index.html'
    return
  }
}

function renderMyPage(data) {
  if (!data) return

  const USER_NAME = document.querySelector('.user')
  const USER_PROFILE = document.querySelector('.profile_thumb')
  const USER_GRADE = document.querySelector('.expert')
  const USER_CREATE_DATE = document.querySelector('.create-date span')

  USER_NAME.textContent = data.user_nickname
  USER_CREATE_DATE.textContent = data.create_date.split(' ')[0]

  // 프로필 이미지
  if (data.user_profile) {
    USER_PROFILE.innerHTML = `<img src="http://leedh9276.dothome.co.kr/likelion-vanilla/users/uploads/profile/${data.user_profile}">`
  } else {
    const thumbName = data.user_nickname.substring(0, 1)
    USER_PROFILE.innerHTML = `<p>${thumbName}</p>`
  }

  const grades = ['초급 개발자', '중급 개발자', '고급 개발자']
  USER_GRADE.textContent = grades[data.user_grade] ?? '???'
}

function renderProfileForm(data) {
  if (!data) return

  document.getElementById('user_nickname').value = data.user_nickname
  document.getElementById('user_id').value = data.user_id
  document.getElementById('user_phone').value = data.user_phone
  document.getElementById('user_intro').innerHTML = data.user_intro
}

// --- 이벤트 리스너 및 UI 제어 ---
const profileBox = document.querySelector('.user_profile__box')
const modifyWrap = document.querySelector('.user__modify-button')
const profileInputs = profileBox.querySelectorAll('input')
const profileIntro = document.getElementById('user_intro')
const userProfile = document.querySelector('.user__thumbnail')

function toggleEditMode(isEdit) {
  if (isEdit) {
    modifyWrap.classList.add('is-modify')
    profileBox.classList.add('is-modify')
    userProfile.classList.add('is-modify')
  } else {
    modifyWrap.classList.remove('is-modify')
    profileBox.classList.remove('is-modify')
    userProfile.classList.remove('is-modify')
  }

  profileInputs.forEach((element) => {
    if (element.id !== 'user_id') element.readOnly = !isEdit
  })
  profileIntro.readOnly = !isEdit
}

modifyWrap.addEventListener('click', (e) => {
  const targetBtn = e.target.closest('.js-button')
  if (!targetBtn) return

  if (targetBtn.id === 'btn_modify') {
    toggleEditMode(true)
  } else if (targetBtn.id === 'btn_submit') {
    toggleEditMode(false)
    updateProfileInfo()
  } else if (targetBtn.id === 'btn_cancel') {
    toggleEditMode(false)
    // 나중에 안 사실이지만, 되돌리기는 저장된 데이터로 불러온다.
    renderProfileForm(userData)
  }
})

// 데이터 전송 로직
async function updateProfileInfo() {
  const form = document.getElementById('user_profiles')
  if (!form) return

  const formData = new FormData(form)
  try {
    const response = await fetch(URLS, {
      method: 'POST',
      body: formData,
    })

    // 성공 시, 서버에서 최신 데이터를 한 번만 다시 불러와 화면 전체를 동기화
    await fetchUserData(true) // true: 기존 캐시를 무시하고 서버에서 새로 받아옴
    renderProfileForm(userData)
    renderMyPage(userData)
  } catch (error) {
    console.error('업데이트 중 에러 발생:', error)
  }
}

async function initPage() {
  await fetchUserData() // 데이터 1번 요청
  renderMyPage(userData) // 화면 그림
  renderProfileForm(userData) // 폼 그림
  userWriteInfo(userData)
}

initPage()

const thumb = document.getElementById('thumb')

thumb.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadProfileImage(file)
})

async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append('profile_image', file);

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://leedh9276.dothome.co.kr/likelion-vanilla/users/upload_profile.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Content-Type은 절대 적지 마세요! (자동 설정됨)
      },
      body: formData // ★ 이 부분이 빠져있어서 Bad Request가 발생했습니다!
    });

    const data = await response.json();

    if (data.status === 'success') {
      alert('프로필 이미지가 성공적으로 변경되었습니다.');
      
      // 화면 업데이트: 서버에서 데이터를 다시 가져와서 이미지 경로를 갱신합니다.
      await fetchUserData(true); 
      renderMyPage(userData);
    } else {
      console.error('업로드 실패:', data.message);
      alert(`업로드 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('파일 업로드 통신 에러:', error);
  }
}



async function userWriteInfo(userData) {
  const user = userData.UID; // userData에서 UID 추출
  const params = new URLSearchParams({ user_id: user }).toString();

  try {
    const response = await fetch(`http://leedh9276.dothome.co.kr/likelion-vanilla/board/search.php?${params}`, {
      method: 'GET',
    });

    // 1. 봉투(response)를 뜯어서 내용물(data)을 가져옵니다.
    const result = await response.json();

    const totalPostForm = document.querySelector('.write__count')
    const totalPostNumber = result.total_posts
    totalPostForm.textContent = totalPostNumber

    // 예: 화면에 개수 표시하기
    // document.getElementById('count').textContent = result.total_posts;

  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
  }
}
