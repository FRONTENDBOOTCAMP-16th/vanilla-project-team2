import { checkToken } from '../../../api/JWT.js'

async function checkIsLoggedIn() {
  const isLoggedIn = await checkToken()

  if (isLoggedIn) {
    alert('이미 로그인 되었습니다.')
    window.location.href = '/src/index.html'
  }
}

checkIsLoggedIn() 

// 로그인
const URLS = 'http://localhost/likelion/users/login.php'

// 변수 설정
const loginButton = document.querySelector('.login__button')
const form = document.getElementById('login')

// 로그인 버튼 로직
loginButton.addEventListener('click', (e) => {
  e.preventDefault()
  const formData = new FormData(form)

    // 1. 모든 에러 메시지 초기화 (이전 에러 지우기)
    const errorTexts = document.querySelectorAll('.error__text');
    errorTexts.forEach(el => el.textContent = '');

    // 2. 검사할 입력 요소들 가져오기
    const nickname = document.getElementById('user_nickname');
    const id = document.getElementById('user_id');
    const password = document.getElementById('user_password');
    const passwordCheck = document.getElementById('user_password_check');
    const phone = document.getElementById('user_phone');

    const showError = (inputElement, message) => {
      const container = inputElement.closest('.user__input');
      const errorEl = container.querySelector('.error__text');
      errorEl.textContent = message;
    }

    switch (true) {
      case id.value.trim() === '':
        showError(id, "해당 값이 비었습니다.");
        break;

      case password.value.trim() === '':
        showError(password, "해당 값이 비었습니다.");
        break;

      default:
      fetch(URLS, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); 
          }
          
          return response.json().then((errorData) => {
            throw errorData; 
          });
        })
        .then((data) => {
          console.log(data)
          if (data.user_id !== undefined) {
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
            window.location.href = `src/pages/users/mypage/index.html`
          }
          return data = data.user_id
        })
        .catch((error) => {
          console.warn('에러: ', error)
          // 이제 error 객체 안에 PHP가 보낸 code가 들어있습니다.
          if (error.code === "00") {
            // id 변수가 이 스코프 내에 정의되어 있어야 합니다.
            showError(id, "잘못된 아이디입니다."); 
          } else if (error.code === "01") {
            // password 변수가 이 스코프 내에 정의되어 있어야 합니다.
            const password = document.getElementById('user_password'); // 예시
            showError(password, "잘못된 비밀번호입니다.");
          } else {
            alert("알 수 없는 오류가 발생했습니다.");
          }
        })
        break;
    }
})


