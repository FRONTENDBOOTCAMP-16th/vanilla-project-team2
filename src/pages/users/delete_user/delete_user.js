import { checkToken } from '../../../api/JWT.js'

let userData = null

async function initMyPage() {
  const fetchedData = await checkToken()
  
  if (fetchedData) {
    userData = fetchedData 
    return userData
  }
}



// 로그인
const URLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/delete_user.php'

// 변수 설정
const deleteButton = document.querySelector('.delete_button')

deleteButton.addEventListener('click', async (e) => {
  await initMyPage()

  console.log(userData)

  const showError = (inputElement, message) => {
    const container = inputElement.closest('.user__input')
    const errorEl = container.querySelector('.error__text')
    errorEl.textContent = message;
  }
  
  const password = document.getElementById('user_password')
  const agree = document.getElementById('check')
  const agreeCheck = agree.checked

  switch (true) {
    case password.value.trim() === '':
      showError(password, "해당 값이 비었습니다.")
      break
    case agreeCheck === false:
      showError(agree, "회원탈퇴에 동의해주세요.")
      break
    default:
      if (confirm('동의하시겠습니까?')) {
        const formData = new FormData();
        formData.append('user_id', userData.user_id);
        formData.append('user_password', password.value);

        const userNickname = userData.user_nickname

        console.log(userData, password.value)
        
        const response = await fetch(URLS, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          const formBox = document.querySelector('.form__container')
          const html = `
            <div class="result__box">
              <p class="result__item deleted">
                <span>${userNickname}</span>님. <br>
                <b>학습방</b>을 이용해주셔서 <br>감사합니다.
              </p>
            </div>
            <a href="/" class="form__button white">
              <span>메인페이지</span>
            </a>`
          formBox.innerHTML = html
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        } else {
          alert('문제가 발생했습니다')
        }
      }
  }

})


