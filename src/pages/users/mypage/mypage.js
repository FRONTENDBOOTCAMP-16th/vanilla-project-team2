// 1. 단순 문자열 가져오기 ('test1')

const userId = sessionStorage.getItem('user')
console.log(userId)
const URLS = `http://localhost/likelion/users/check.php`
const sendData = {
  user_id: userId,
}

console.log(sendData)

// 값이 없으면 로그인 페이지로 리다이렉트
// if (!userId) {
//   window.location.href = '/src/pages/users/login/index.html'
// }

function myPage() {
  fetch(URLS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendData), 
  })
    .then((res) => res.json())
    .then((response) => {
      const result = response.data !== undefined ? response.data : response;
      console.log('파싱된 결과:', result)

      // 1. 프로필 이미지 업데이트
      const profile = document.querySelector('.user__profile > img')
      if (profile && result.user_profile) {
        profile.setAttribute(
          'src',
          `http://localhost/likelion/users/uploads/profile/${result.user_profile}`
        )
      }

      const userProfileBox = document.querySelector('.profile__container')
      const userProfileTitle = userProfileBox.querySelector('h2')
      const userProfileGrade = userProfileBox.querySelector('.expert')
      const createDate = userProfileBox.querySelector('.create-date')

      userProfileTitle.textContent = result.user_nickname
      createDate.textContent = result.create_date

      switch (result.user_grade) {
        case (0): {
          userProfileGrade.textContent = '초보 개발자'
          break
        }
        case (1): {
          userProfileGrade.textContent = '중급 개발자'
          break
        }
        case (2): {
          userProfileGrade.textContent = '고급 개발자'
          break
        }
        default: {
          userProfileGrade.textContent = '???'
        }
      }


      // 2. input 요소(태그) 자체를 가져오기 (.value를 빼고 요소만 가져옵니다)
      const nicknameInput = document.getElementById('user_nickname')
      const idInput = document.getElementById('user_id') // user_phone으로 되어있던 오타 수정
      const phoneInput = document.getElementById('user_phone')

      // 3. 해당 요소의 value 속성에 서버에서 받아온 데이터 집어넣기
      if (nicknameInput) nicknameInput.value = result.user_nickname
      if (idInput) idInput.value = result.user_id
      if (phoneInput) phoneInput.value = result.user_phone
      
    })
    .catch((error) => console.error('에러:', error))
}

myPage()
