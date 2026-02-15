// 로그인 상황 확인
const userInfo = sessionStorage.getItem('user')
if (userInfo != undefined || userInfo) window.location.href = '/index.html'

// 로그인
const URLS = 'http://localhost/likelion/users/sign_up.php'
const form = document.getElementById('signup')
const formElement = form.children

form.addEventListener('click', (e) => {
  if (e.target.matches('.form__button')) {
    e.preventDefault()

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
      // 1) 닉네임 공백 체크
      case nickname.value.trim() === '':
        showError(nickname, "해당 값이 비었습니다.");
        break;

      // 2) 아이디 공백 체크
      case id.value.trim() === '':
        showError(id, "해당 값이 비었습니다.");
        break;

      // 3) 비밀번호 공백 체크
      case password.value.trim() === '':
        showError(password, "해당 값이 비었습니다.");
        break;

      // 4) 비밀번호 확인 공백 체크
      case passwordCheck.value.trim() === '':
        showError(passwordCheck, "해당 값이 비었습니다.");
        break;

      // 5) 전화번호 공백 체크
      case phone.value.trim() === '':
        showError(phone, "해당 값이 비었습니다.");
        break;

      // 6) 비밀번호 불일치 체크 (가장 중요한 로직)
      case password.value !== passwordCheck.value:
        showError(passwordCheck, "비밀번호가 일치하지 않습니다.");
        break;

      // 7) 모든 검사를 통과했을 때 (default)
      default:
        const formData = new FormData(form);
        
        fetch(URLS, {
          method: 'POST',
          body: formData,
        })
          // ★ 디버깅: 일단 text()로 받아서 에러 내용을 눈으로 확인하세요.
          .then((response) => response.text()) 
          .then((text) => {
            console.log('서버 원본 응답:', text); // 여기에 PHP 에러가 찍힙니다.

            // 확인 후에는 다시 아래 코드로 복구해서 쓰시면 됩니다.
            try {
              const data = JSON.parse(text);
              if (data.status === 'success') {
                alert('가입 완료!');
                window.location.href = '/login.html'; // 가입 후 이동
              } else {
                alert('에러: ' + data.message);
              }
            } catch (e) {
              console.error('JSON 변환 실패. PHP 에러일 가능성 높음');
            }
          })
          .catch((error) => console.error('통신 에러:', error));
        break;
    }
  }
})
