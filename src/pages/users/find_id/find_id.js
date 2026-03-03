// (상단의 showError, clearErrors 함수는 그대로 유지합니다)

const URLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/find_id.php';
const form = document.getElementById('find_id');

const showError = (inputElement, message) => {
  const container = inputElement.closest('.user__input')
  const errorEl = container.querySelector('.error__text')
  errorEl.textContent = message;
}

const clearErrors = (formElement) => {
  const errorEls = formElement.querySelectorAll('.error__text');
  errorEls.forEach(el => el.textContent = '');
};

if (form) {
  form.addEventListener('click', (e) => {
    const submitBtn = e.target.closest('.find_id');
    
    if (submitBtn) {
      e.preventDefault();
      
      // 기존 에러 초기화
      clearErrors(form);

      // 인풋 요소 가져오기 (HTML의 id 속성 확인 필요)
      const nameInput = document.getElementById('user_nickname');
      const phoneInput = document.getElementById('user_phone');
      
      let isFormValid = true;

      // 1. 프론트엔드 방어 로직: 빈 값 체크
      if (nameInput && nameInput.value.trim() === '') {
        showError(nameInput, '이름(닉네임)을 입력해주세요.');
        isFormValid = false;
      }
      
      if (phoneInput && phoneInput.value.trim() === '') {
        showError(phoneInput, '휴대전화 번호를 입력해주세요.');
        isFormValid = false;
      }

      if (!isFormValid) return; // 통신 중단
      
      // 로딩 UI 적용
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '조회 중...⏳';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      
      fetch(URLS, {
        method: 'POST',
        body: formData,
      })
        .then(async (response) => {
          const data = await response.json();
          // 서버에서 status가 error로 오면 catch로 넘기기
          if (!response.ok || data.status === 'error') {
            throw data;
          }
          return data;
        })
        .then((data) => {
          if (data.status === 'success') {
            const formContainer = document.querySelector('.form__container');
            const html = `
              <div class="result__box">
                <p class="result__item">
                  회원님의 아이디는 <strong>${data.user_id}</strong> 입니다.
                </p>
              </div>
              <a href="../login/index.html" class="form__button login">
                <span>로그인</span>
              </a>
              <div class="form__login">
                <span class="login__text">비밀번호를 잊으셨나요?</span>
                <a href="../reset_password/index.html">비밀번호 초기화</a>
              </div>
            `;
            formContainer.innerHTML = html;
          }
        })
        .catch((error) => {
          console.error('에러:', error);
          
          // 2. 백엔드 방어 로직에 따른 에러 메시지 분기 처리
          if (error && error.status === 'error') {
            switch(error.errorCode) {
              case 'NICKNAME_MISMATCH':
                showError(nameInput, error.message);
                break;
              case 'USER_NOT_FOUND':
                showError(phoneInput, error.message);
                break;
              case 'MISSING_INPUT':
                showError(phoneInput, '입력값을 다시 확인해주세요.');
                break;
              default:
                showError(phoneInput, error.message || '일치하는 정보가 없습니다.');
            }
          } else {
            showError(phoneInput, '서버와 통신 중 문제가 발생했습니다.');
          }
        })
        .finally(() => {
          // 상태 원상 복구
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        });
    }
  });
}