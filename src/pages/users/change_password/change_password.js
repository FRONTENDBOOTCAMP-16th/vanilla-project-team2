import { checkToken } from '../../../api/JWT.js'
const fetchedData = await checkToken()

// 로그인
const pwCheckURLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/check_password.php'
const changePwURLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/change_password.php'

// 변수 설정
const loginButton = document.querySelector('.change-pw__button')
const form = document.getElementById('change_password')

const showError = (inputElement, message) => {
  const container = inputElement.closest('.user__input')
  const errorEl = container.querySelector('.error__text')
  errorEl.textContent = message;
}

loginButton.addEventListener('click', async (e) => {


  const errorTexts = document.querySelectorAll('.error__text')
  errorTexts.forEach(el => el.textContent = '')

  const oldPassword = document.getElementById('user_password')
  const newPassword = document.getElementById('new_user_password')
  const checkPassword = document.getElementById('new_user_password_check')

  const formData = new FormData()
  formData.append('user_id', fetchedData.user_id);
  formData.append('user_password', oldPassword.value);

  const pwFormData = new FormData()
  pwFormData.append('user_id', fetchedData.user_id);
  pwFormData.append('user_password', newPassword.value);


  switch (true) {
    case (oldPassword.value === null || oldPassword.value === undefined || oldPassword.value === ''): {
      showError(oldPassword, '비밀번호를 입력하세요')
      break
    }
    case (newPassword.value === null || newPassword.value === undefined || newPassword.value === ''): {
      showError(newPassword, '비밀번호를 입력하세요')
      break
    }
    case (checkPassword.value === null || checkPassword.value === undefined || checkPassword.value === ''): {
      showError(checkPassword, '비밀번호를 입력하세요')
      break
    }
    case (checkPassword.value !== newPassword.value): {
      showError(newPassword, '비밀번호가 일치하지 않습니다')
      break
    }
    default: {
      // 비밀번호 검증
      fetch(pwCheckURLS, {
        method: 'POST',
        body: formData,
      })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
          // 패스워드 변경
          fetch(changePwURLS, {
            method: 'POST',
            body: pwFormData
          })
            .then((res) => {
              if (res.status === 200) {
                alert('비밀번호 변경이 완료되었습니다')
              }
            })
        }
        if (res.status === 401) {
          showError(oldPassword, '비밀번호가 일치하지 않습니다')
        }        
      })
      .catch((error) => {
        showError(oldPassword, error)
      })


    }
  }


})