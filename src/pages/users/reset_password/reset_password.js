import { checkToken } from '../../../api/JWT.js'

async function initMyPage() {
  const fetchedData = await checkToken()

  if (fetchedData) {
    alert('이미 로그인하셨습니다.')
    window.location.href = '/index.html'
  }
}

initMyPage()

// 1. 에러 표시 및 초기화 함수 추가
const showError = (inputElement, message) => {
  const container = inputElement.closest('.user__input');
  if (!container) return; 
  
  const errorEl = container.querySelector('.error__text');
  if (errorEl) {
    errorEl.textContent = message;
  }
};

const clearErrors = (formElement) => {
  const errorEls = formElement.querySelectorAll('.error__text');
  errorEls.forEach(el => el.textContent = '');
};

// 로그인 및 비밀번호 초기화 설정
const URLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/reset_password.php'
const form = document.getElementById('reset_pw')

// 2. form이 존재하는 페이지에서만 실행되도록 보호 (에러 방지)
if (form) {
  form.addEventListener('click', (e) => {
    const submitBtn = e.target.closest('.reset_password')

    if (submitBtn) {
      e.preventDefault()
     
      // 클릭 시 기존 에러 메시지 초기화
      clearErrors(form);

      // 인풋 요소 자체를 가져옵니다. (showError에 넘겨주기 위함)
      const idInput = document.getElementById('user_id')
      const nameInput = document.getElementById('user_nickname')
      const phoneInput = document.getElementById('user_phone')

      let isFormValid = true;

      // 3. 빈 값 검증 (switch 대신 개별 if문을 사용하여 여러 개의 빈 칸 에러를 동시에 보여줌)
      if (idInput.value.trim() === '') {
        showError(idInput, '아이디를 입력해주세요.');
        isFormValid = false;
      }
      
      if (nameInput.value.trim() === '') {
        showError(nameInput, '이름(닉네임)을 입력해주세요.');
        isFormValid = false;
      }
      
      if (phoneInput.value.trim() === '') {
        showError(phoneInput, '휴대전화 번호를 입력해주세요.');
        isFormValid = false;
      }

      // 하나라도 빈 값이 있다면 통신 중단
      if (!isFormValid) return;

      // 4. 로딩 UI 추가: 진행 중임을 알리고 중복 클릭 방지
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '초기화 진행 중...⏳';
      submitBtn.disabled = true;
      const formData = new FormData(form)
      
      fetch(URLS, {
        method: 'POST',
        body: formData,
      })
        .then(async (response) => {
          const data = await response.json();
          
          // 👉 [수정된 부분] response.ok가 아니거나(네트워크 에러), 서버에서 보낸 JSON의 status가 'error'라면 catch로 던짐!
          if (!response.ok || data.status === 'error') {
            throw data;
          }
          return data; 
        })
        .then((data) => {
          // 5. 성공 처리 (200 OK & status === 'success')
          if (data.status === 'success') {
            const formContainer = document.querySelector('.form__container')
            const html = `
              <div class="result__box">
                <p class="result__item">
                  <span>${data.message}</span>님의 비밀번호는 <strong>0000</strong>로 초기화 되었습니다.
                </p>
              </div>
              <a href="../login/index.html" class="form__button login">
                <span>로그인</span>
              </a>
              <div class="form__login">
                <span class="login__text">반드시 로그인 후 비밀번호를 변경해주세요</span>
              </div>
            `
            formContainer.innerHTML = html
          }
        })
        .catch((error) => {
          console.error('에러:', error)
          
          // 6. 실패 처리 (alert 대신 알맞은 input 아래에 showError 적용)
          if (error && error.status === 'error') {
              switch(error.errorCode) {
                  case 'USER_NOT_FOUND':
                      showError(idInput, '가입된 아이디가 없습니다.');
                      break;
                  case 'NICKNAME_MISMATCH':
                      showError(nameInput, '계정의 이름과 일치하지 않습니다.');
                      break;
                  case 'PHONE_MISMATCH':
                      showError(phoneInput, '계정의 휴대전화 번호와 일치하지 않습니다.');
                      break;
                  case 'DB_UPDATE_ERROR':
                      showError(phoneInput, '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                      break;
                  default:
                      showError(phoneInput, error.message || '초기화에 실패했습니다. 정보를 확인해주세요.');
              }
          } else {
              // 네트워크 에러 등의 경우 마지막 인풋(또는 첫번째 인풋)에 메시지 표시
              showError(phoneInput, '서버와 통신 중 문제가 발생했습니다.');
          }
        })
        .finally(() => {
          // 7. 요청이 완전히 끝나면 버튼 상태 원상 복구
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        })
    }
  })
}