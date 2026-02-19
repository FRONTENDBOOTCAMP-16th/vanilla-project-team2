import { checkToken } from '../../../api/JWT.js'
const URLS = 'http://localhost/likelion/users/update_user.php'

// 1. 객체를 담을 변수이므로 null로 초기화하는 것이 깔끔합니다.
let userData = null 

async function initMyPage() {
  const fetchedData = await checkToken()
  
  if (fetchedData) {
    console.log('토큰 검증 성공! 데이터를 불러옵니다.')
    userData = fetchedData 
    return userData
  } else {
    console.warn('유효하지 않은 접근입니다.')
    window.location.href = '/src/index.html'
  }
}

async function updateMyPage() {
  const userDatas = await initMyPage()

  console.log(userDatas)
  if (!userDatas) { 
    alert('로그인 되지 않은 회원입니다.')
  }
  
  const USER_NAME = document.querySelector('.user')
  const USER_PROFILE = document.querySelector('.profile_thumb')
  const USER_GRADE = document.querySelector('.expert')
  const USER_CREATE_DATE = document.querySelector('.create-date span')

  USER_NAME.textContent = userDatas.user_nickname
  USER_CREATE_DATE.textContent = userDatas.create_date

  // 프로필 이미지
  if (userDatas.user_profile) {
    const html = `
      <img src="http://leedh9276.dothome.co.kr/likelion-vanilla/users/upload/profile/${userDatas.user_profile}">
    `
    USER_PROFILE.innerHTML = html
  } else {
    const userName = userDatas.user_nickname
    const thumbName = userName.substring(1, 0)
    const html = `
      <p>${thumbName}</p>
    `
    USER_PROFILE.innerHTML = html
  }


  
  // 회원등급
  switch (userDatas.user_grade) {
    case (0) : {
      USER_GRADE.textContent = '초급 개발자'
      break
    }
    case (1): {
      USER_GRADE.textContent = '중급 개발자'
      break
    }
    case (2): {
      USER_GRADE.textContent = '고급 개발자'
      break
    }
    default : {
      USER_GRADE.textContent = '???'
      break
    }
  }
}


const modifyWrap = document.querySelector('.user__modify-button')
const profileWrap = document.querySelector('.user_profile__box')
const profileInputs = profileWrap.querySelectorAll('input')
const profileIntro = document.getElementById('user_intro')
const userProfile = document.querySelector('.user__thumbnail')

modifyWrap.addEventListener('click', (e) => {
// 1. 클릭된 요소가 '.js-button' 클래스를 가진 요소인지 확인
  if (e.target.matches('.js-button')) {
    if (e.target.id === 'btn_modify') {
      console.log('변경 버튼 클릭됨!')
      modifyWrap.classList.add('is-modify')
      for (const element of profileInputs) {
        if (element.matches('#user_id')) continue;
        element.readOnly = false        
      }
      profileIntro.readOnly = false

      userProfile.classList.add('is-modify')
    }
    else if (e.target.id === 'btn_submit') {
      userProfile.classList.remove('is-modify')
      modifyWrap.classList.remove('is-modify')
      profileInputs.forEach(element => {
        element.readOnly = true
      })
      profileIntro.readOnly = true
      updateProfileInfo()
    }
    else if (e.target.id === 'btn_cancel') {
      userProfile.classList.remove('is-modify')
      modifyWrap.classList.remove('is-modify')
      profileInputs.forEach(element => {
        element.readOnly = true
      })
      profileIntro.readOnly = true
      updateProfile()
    }
  }
})

async function updateProfile() { 
  const userDatas = await initMyPage()

  const userNickname = document.getElementById('user_nickname')
  const userID = document.getElementById('user_id')
  const userPhone = document.getElementById('user_phone')
  const userIntro = document.getElementById('user_intro')

  userNickname.value = userDatas.user_nickname
  userID.value = userDatas.user_id
  userPhone.value = userDatas.user_phone
  userIntro.innerHTML = userDatas.user_intro
}

async function updateProfileInfo() {
const form = document.getElementById('user_profiles')
  if (!form) {
    console.error('폼 요소를 찾을 수 없습니다.')
    return
  }

  const formData = new FormData(form);
  try {
    const response = await fetch(URLS, {
      method: 'POST',
      body: formData,
    });
    const text = await response.text(); 
    console.log('서버 응답:', text); 
    await updateProfile(); 
    await updateMyPage(); 
    
  } catch (error) {
    console.error('업데이트 중 에러 발생:', error);
  }
}

const thumb = document.getElementById('thumb')

thumb.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file) return 
  uploadProfileImage(file)
})

async function uploadProfileImage(file) {
  // 1. FormData 객체 생성
  const formData = new FormData()
  
  // 2. 'profile_image'라는 이름(Key)으로 파일 객체(Value)를 담습니다.
  // PHP에서는 $_FILES['profile_image'] 로 이 파일을 꺼내게 됩니다.
  formData.append('profile_image', file) 

  const accessToken = localStorage.getItem('access_token')

  try {
    const response = await fetch('http://localhost/likelion/users/upload_profile.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
      },
      body: formData, // JSON.stringify 없이 formData 객체를 그대로 넣습니다.
    })

    const data = await response.json()

    if (data.status === 'success') {
      alert('프로필 이미지가 성공적으로 변경되었습니다.')
    } else {
      console.error('업로드 실패:', data.message)
      alert('업로드에 실패했습니다.')
    }
  } catch (error) {
    console.error('파일 업로드 통신 에러:', error)
  }
}


updateMyPage();
updateProfile()





