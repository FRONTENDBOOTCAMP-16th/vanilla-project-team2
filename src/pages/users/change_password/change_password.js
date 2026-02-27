import { checkToken } from '../../../api/JWT.js'
const fetchedData = await checkToken()

const pwCheckURLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/check_password.php'
const changePwURLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/change_password.php'

const form = document.getElementById('change_password')
const loginButton = document.querySelector('.change-pw__button')

const showError = (inputElement, message) => {
  const container = inputElement.closest('.user__input')
  const errorEl = container.querySelector('.error__text')
  errorEl.textContent = message;
}

// 버튼 클릭이 아닌 '폼 제출(submit)' 이벤트를 감지합니다.
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const errorTexts = document.querySelectorAll('.error__text');
  errorTexts.forEach(el => el.textContent = '');

  const oldPassword = document.getElementById('user_password');
  const newPassword = document.getElementById('new_user_password');
  const checkPassword = document.getElementById('new_user_password_check');

  if (!oldPassword.value) return showError(oldPassword, '현재 비밀번호를 입력하세요');
  if (!newPassword.value) return showError(newPassword, '새 비밀번호를 입력하세요');
  if (newPassword.value !== checkPassword.value) return showError(checkPassword, '비밀번호가 일치하지 않습니다');

  const formData = new FormData();
  formData.append('user_id', fetchedData.user_id);
  formData.append('user_password', oldPassword.value);

  const pwFormData = new FormData();
  pwFormData.append('user_id', fetchedData.user_id);
  pwFormData.append('user_password', newPassword.value);

  // 성공 여부를 체크하는 변수 추가
  let isSuccess = false;

  try {
    loginButton.disabled = true;
    loginButton.textContent = '처리 중...';

    const checkRes = await fetch(pwCheckURLS, { method: 'POST', body: formData });
    
    if (checkRes.status === 401) {
      showError(oldPassword, '비밀번호가 일치하지 않습니다');
      return; // 에러 시 아래 finally 블록으로 이동하여 버튼 복구됨
    }

    if (checkRes.ok) {
      const changeRes = await fetch(changePwURLS, { method: 'POST', body: pwFormData });
      
      if (changeRes.ok) {
        isSuccess = true; // 성공 표시
        alert('비밀번호 변경이 완료되었습니다.');
        window.location.replace('/src/pages/users/mypage/index.html');
      } else {
        throw new Error('비밀번호 변경 실패');
      }
    }
  } catch (error) {
    console.error(error);
    alert('서버와의 통신에 실패했습니다.');
  } finally {
    // 성공해서 페이지를 이동할 때는 버튼을 다시 활성화하지 않음
    if (!isSuccess) {
      loginButton.disabled = false;
      loginButton.textContent = '변경하기';
    }
  }
});