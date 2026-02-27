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
  // 1. 필수: 폼의 기본 제출 동작 방지 (새로고침 방지)
  e.preventDefault();

  const errorTexts = document.querySelectorAll('.error__text');
  errorTexts.forEach(el => el.textContent = '');

  const oldPassword = document.getElementById('user_password');
  const newPassword = document.getElementById('new_user_password');
  const checkPassword = document.getElementById('new_user_password_check');

  // 유효성 검사 (기존 로직 유지)
  if (!oldPassword.value) return showError(oldPassword, '현재 비밀번호를 입력하세요');
  if (!newPassword.value) return showError(newPassword, '새 비밀번호를 입력하세요');
  if (newPassword.value !== checkPassword.value) return showError(checkPassword, '비밀번호가 일치하지 않습니다');

  // 데이터 준비
  const formData = new FormData();
  formData.append('user_id', fetchedData.user_id);
  formData.append('user_password', oldPassword.value);

  const pwFormData = new FormData();
  pwFormData.append('user_id', fetchedData.user_id);
  pwFormData.append('user_password', newPassword.value);

  try {
    // 버튼 비활성화 (중복 클릭 방지 및 사용자 경험 개선)
    loginButton.disabled = true;
    loginButton.textContent = '처리 중...';

    // 1단계: 비밀번호 검증
    const checkRes = await fetch(pwCheckURLS, { method: 'POST', body: formData });
    
    if (checkRes.status === 401) {
      showError(oldPassword, '비밀번호가 일치하지 않습니다');
      loginButton.disabled = false;
      loginButton.textContent = '변경하기';
      return;
    }

    if (checkRes.ok) {
      // 2단계: 패스워드 변경
      const changeRes = await fetch(changePwURLS, { method: 'POST', body: pwFormData });
      
      if (changeRes.ok) {
        alert('비밀번호 변경이 완료되었습니다.');
        // alert 확인 후 즉시 이동
        window.location.replace('/src/pages/users/mypage/index.html');
      } else {
        throw new Error('비밀번호 변경 중 오류가 발생했습니다.');
      }
    }
  } catch (error) {
    console.error(error);
    alert('서버와의 통신에 실패했습니다.');
  } finally {
    // 실패했을 경우를 대비해 버튼 복구
    loginButton.disabled = false;
    loginButton.textContent = '변경하기';
  }
});