import { checkToken } from '../../../api/JWT.js'
const URLS = 'https://leedh9276.dothome.co.kr/likelion-vanilla/users/update_user.php'
const UPLOAD_PROFILE_URL = 'https://leedh9276.dothome.co.kr/likelion-vanilla/users/upload_profile.php'
const MAX_PROFILE_IMAGE_SIZE = 500 * 1024
const ALLOWED_PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

let userData = null

// 인증 결과는 화면 렌더링과 저장 요청에서 반복 사용하므로 메모리에 보관한다.
// forceRefresh는 프로필 수정이나 이미지 업로드 후 서버의 최신 값을 다시 읽을 때 사용한다.
async function fetchUserData(forceRefresh = false) {
  if (userData && !forceRefresh) return userData

  const fetchedData = await checkToken()
  if (fetchedData) {
    userData = fetchedData
    return userData
  } else {
    alert('유효하지 않은 접근입니다.')
    window.location.href = (window.ROOT_PATH || './') + 'index.html'
    return
  }
}

// 인증 API가 반환한 사용자 데이터를 읽기 전용 프로필 영역에 반영한다.
function renderMyPage(data) {
  if (!data) return

  const USER_NAME = document.querySelector('.user')
  const USER_PROFILE = document.querySelector('.profile_thumb')
  const USER_GRADE = document.querySelector('.expert')
  const USER_CREATE_DATE = document.querySelector('.create-date span')

  USER_NAME.textContent = data.user_nickname
  USER_CREATE_DATE.textContent = data.create_date.split(' ')[0]

  // 저장된 이미지가 없으면 닉네임 첫 글자를 대체 아바타로 사용한다.
  if (data.user_profile) {
    USER_PROFILE.innerHTML = `<img src="https://leedh9276.dothome.co.kr/likelion-vanilla/users/uploads/profile/${data.user_profile}">`
  } else {
    const thumbName = data.user_nickname.substring(0, 1)
    USER_PROFILE.innerHTML = `<p>${thumbName}</p>`
  }

  const grades = ['초급 개발자', '중급 개발자', '고급 개발자']
  USER_GRADE.textContent = grades[data.user_grade] ?? '???'
}

// 수정 폼은 서버에 저장된 값을 기준으로 채운다. 취소 시에도 같은 함수로 원래 값을 복원한다.
function renderProfileForm(data) {
  if (!data) return

  document.getElementById('user_nickname').value = data.user_nickname
  document.getElementById('user_intro').value = data.user_intro
}

// update_user.php는 숫자 UID가 아니라 로그인 계정값인 user_id를 수정 대상 식별자로 사용한다.
function getAccountUserId() {
  return userData?.user_id
}

// 일부 PHP 엔드포인트는 오류 상황에서 JSON이 아닌 문자열이나 HTML을 반환할 수 있어 응답 파싱을 방어한다.
async function parseJsonResponse(response) {
  const responseText = await response.text()

  try {
    const data = responseText ? JSON.parse(responseText) : {}
    return data
  } catch {
    console.error('JSON이 아닌 서버 응답:', {
      status: response.status,
      url: response.url,
      body: responseText.slice(0, 300),
    })
    throw new Error('서버가 JSON 대신 HTML/문자열을 응답했습니다.')
  }
}

const profileBox = document.querySelector('.user_profile__box')
const modifyWrap = document.querySelector('.user__modify-button')
const profileInputs = profileBox.querySelectorAll('input')
const profileIntro = document.getElementById('user_intro')
const userProfile = document.querySelector('.user__thumbnail')

profileBox.addEventListener('submit', (e) => {
  e.preventDefault()
})

// 수정 모드는 CSS 클래스와 readOnly 속성을 함께 바꿔 시각 상태와 입력 가능 상태를 일치시킨다.
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
    // 취소는 입력 전 상태를 다시 그리는 방식으로 임시 변경 값을 버린다.
    renderProfileForm(userData)
  }
})

// FormData는 폼의 현재 값을 그대로 담아 PHP의 $_POST 계약에 맞춰 전송한다.
async function updateProfileInfo() {
  const form = document.getElementById('user_profiles')
  if (!form) return

  const formData = new FormData(form)
  const userId = getAccountUserId()

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
    alert('프로필이 성공적으로 수정되었습니다.')
  } catch (error) {
    console.error('업데이트 중 에러 발생:', error)
  }
}

// 초기화는 인증, 화면 렌더링, 활동 통계 조회 순서로 진행해 사용자 데이터 의존성을 명확히 한다.
async function initPage() {
  const authenticatedUser = await fetchUserData()
  if (!authenticatedUser) return
  renderMyPage(userData)
  renderProfileForm(userData)
  userWriteInfo(userData)
}

initPage()

const thumb = document.getElementById('thumb')

// 파일 선택 직후 브라우저에서 MIME 타입과 크기를 먼저 검증해 불필요한 업로드 요청을 줄인다.
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

// 업로드 API는 Authorization 토큰의 sub 값으로 사용자를 식별하므로 별도 user_id 필드를 보내지 않는다.
async function uploadProfileImage(file) {
  const formData = new FormData()

  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    alert('로그인이 필요합니다.')
    return
  }

  formData.append('profile_image', file)
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

      // 파일명은 서버가 생성하므로 업로드 후 인증 데이터를 다시 읽어 이미지 경로를 갱신한다.
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


// 활동 통계 API는 게시글과 댓글 작성자를 숫자 UID로 집계한다.
async function userWriteInfo(userData) {
  const user = userData.UID
  const formData = new FormData()
  formData.append('user_id', user)

  try {
    const response = await fetch(`https://leedh9276.dothome.co.kr/likelion-vanilla/users/user_posts.php`, {
      method: 'POST',
      body: formData
    })

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
