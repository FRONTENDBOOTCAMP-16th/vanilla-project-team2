import { checkToken } from '../../../api/JWT.js'
const URLS = 'https://leedh9276.dothome.co.kr/likelion-vanilla/users/update_user.php'
const UPLOAD_PROFILE_URL = 'https://leedh9276.dothome.co.kr/likelion-vanilla/users/upload_profile.php'
const MAX_PROFILE_IMAGE_SIZE = 500 * 1024
const ALLOWED_PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

let userData = null

async function fetchUserData(forceRefresh = false) {
  if (userData && !forceRefresh) return userData

  const fetchedData = await checkToken()
  if (fetchedData) {
    userData = fetchedData
    return userData
  } else {
    alert('유효하지 않은 접근입니다.')
    window.location.href = '/index.html'
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
    USER_PROFILE.innerHTML = `<img src="https://leedh9276.dothome.co.kr/likelion-vanilla/users/uploads/profile/${data.user_profile}">`
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
  document.getElementById('user_intro').value = data.user_intro
}

function getCurrentUserId() {
  return userData?.UID ?? userData?.user_id
}

async function parseJsonResponse(response) {
  const responseText = await response.text()

  try {
    const data = responseText ? JSON.parse(responseText) : {}
    return data
  } catch (error) {
    console.error('JSON이 아닌 서버 응답:', {
      status: response.status,
      url: response.url,
      body: responseText.slice(0, 300),
    })
    throw new Error('서버가 JSON 대신 HTML/문자열을 응답했습니다.')
  }
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
  const userId = getCurrentUserId()

  if (!userId) {
    alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해 주세요.')
    return
  }

  formData.set('user_id', userId)

  try {
    const response = await fetch(URLS, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('프로필 수정 서버 응답 오류:', errorText)
      throw new Error(`프로필 수정 요청 실패 (${response.status})`)
    }

    await fetchUserData(true)
    renderProfileForm(userData)
    renderMyPage(userData)
    alert('프로필이 성공적으로 수정되었습니다.') // 성공 알림 추가
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

  if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
    alert('이미지 파일(jpg, png, gif, webp)만 업로드 가능합니다.')
    thumb.value = ''
    return
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    alert('파일 크기는 500KB를 초과할 수 없습니다.')
    thumb.value = ''
    return
  }

  uploadProfileImage(file)
})

async function uploadProfileImage(file) {
  const formData = new FormData()
  const userId = getCurrentUserId()

  if (!userId) {
    alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해 주세요.')
    return
  }

  formData.append('profile_image', file)
  formData.append('user_id', userId)

  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    alert('로그인이 필요합니다.')
    return
  }

  formData.append('access_token', accessToken)

  try {
    const response = await fetch(UPLOAD_PROFILE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData
    })

    const data = await parseJsonResponse(response)

    if (!response.ok) {
      throw new Error(data.message ?? `프로필 이미지 업로드 요청 실패 (${response.status})`)
    }

    if (data.status === 'success') {
      alert('프로필 이미지가 성공적으로 변경되었습니다.')

      // 화면 업데이트: 서버에서 데이터를 다시 가져와서 이미지 경로를 갱신합니다.
      await fetchUserData(true)
      renderMyPage(userData)
    } else {
      console.error('업로드 실패:', data.message)
      alert(`업로드 실패: ${data.message}`)
      thumb.value = ''
    }
  } catch (error) {
    console.error('파일 업로드 통신 에러:', error)
    alert(error.message)
    thumb.value = ''
  }
}



async function userWriteInfo(userData) {
  const user = userData.UID
  const formData = new FormData()
  formData.append('user_id', user) // PHP의 $_POST['user_id']로 들어감

  try {
    const response = await fetch(`https://leedh9276.dothome.co.kr/likelion-vanilla/users/user_posts.php`, {
      method: 'POST',
      body: formData // ✅ 객체 대신 FormData를 넣습니다.
    })

    // 1. 봉투(response)를 뜯어서 내용물(data)을 가져옵니다.
    const result = await response.json()

    const totalPostForm = document.querySelector('.write .write__count')
    const totalCommentForm = document.querySelector('.comment .write__count')
    const totalPostNumber = result.post_count
    const totalCommentNumber = result.comment_count
    totalPostForm.textContent = totalPostNumber
    totalCommentForm.textContent = totalCommentNumber

  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error)
  }
}
