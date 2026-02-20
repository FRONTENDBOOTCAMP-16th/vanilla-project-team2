// 로그인 상황 확인
import { checkToken } from '../../../api/JWT.js'
const fetchedData = await checkToken()
if (fetchedData) {
  alert('이미 로그인 되어 있습니다.')
  window.location.href = '/src/index.html'
}

// 로그인
const URLS =
  'http://leedh9276.dothome.co.kr/likelion-vanilla//users/sign_up.php'
const form = document.getElementById('signup')

form.addEventListener('click', (e) => {
  if (e.target.matches('.form__button')) {
    e.preventDefault()

    // 에러 텍스트 초기화
    const errorTexts = document.querySelectorAll('.error__text')
    errorTexts.forEach((el) => (el.textContent = ''))

    // 모든 input을 변수에 담아두기
    const nickname = document.getElementById('user_nickname')
    const id = document.getElementById('user_id')
    const password = document.getElementById('user_password')
    const passwordCheck = document.getElementById('user_password_check')
    const phone = document.getElementById('user_phone')

    // 애러 메시지가 떴다면 해당 내용으로 출력하도록
    const showError = (inputElement, message) => {
      const container = inputElement.closest('.user__input')
      const errorEl = container.querySelector('.error__text')
      errorEl.textContent = message
    }

    switch (true) {
      // 1) 닉네임 공백 체크
      case nickname.value.trim() === '':
        showError(nickname, '해당 값이 비었습니다.')
        break

      // 2) 아이디 공백 체크
      case id.value.trim() === '':
        showError(id, '해당 값이 비었습니다.')
        break

      // 3) 비밀번호 공백 체크
      case password.value.trim() === '':
        showError(password, '해당 값이 비었습니다.')
        break

      // 4) 비밀번호 확인 공백 체크
      case passwordCheck.value.trim() === '':
        showError(passwordCheck, '해당 값이 비었습니다.')
        break

      // 5) 전화번호 공백 체크
      case phone.value.trim() === '':
        showError(phone, '해당 값이 비었습니다.')
        break

      // 6) 비밀번호 불일치 체크
      case password.value !== passwordCheck.value:
        showError(passwordCheck, '비밀번호가 일치하지 않습니다.')
        break

      // 7) 모든 검사를 통과했을 때 (default)
      default:
        const formData = new FormData(form)

        fetch(URLS, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.text())
          .then((text) => {
            console.log('서버 원본 응답:', text)
            // try, catch 사용
            try {
              const data = JSON.parse(text)
              if (data.status === 'success') {
                alert('가입 완료!')
                window.location.href = '/src/pages/users/login/index.html'
              } else {
                alert('에러: ' + data.message)
              }
            } catch (e) {
              console.error('JSON 변환 실패. PHP 에러일 가능성 높음')
            }
          })
          .catch((error) => console.error('통신 에러:', error))
        break
    }
  }
})
