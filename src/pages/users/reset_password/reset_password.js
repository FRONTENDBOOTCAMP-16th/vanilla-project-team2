import { checkToken } from '../../../api/JWT.js'

async function initMyPage() {
  const fetchedData = await checkToken()

  if (fetchedData) {
    alert('이미 로그인하셨습니다.')
    window.location.href = '/index.html'
  }
}

initMyPage()
// 로그인
const URLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/reset_password.php'
const form = document.getElementById('reset_pw')

form.addEventListener('click', (e) => {
  // 1. matches 대신 closest를 사용하여 버튼 내부를 클릭해도 정확히 버튼을 찾도록 수정
  const submitBtn = e.target.closest('.reset_password')

  if (submitBtn) {
    e.preventDefault()
    
    // 2. 로딩 UI 추가: 진행 중임을 알리고 중복 클릭 방지
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '초기화 진행 중...⏳';
    submitBtn.disabled = true;

    const formData = new FormData(form)
    
    fetch(URLS, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        
        // 3. 성공 처리
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
        // 4. 실패 처리 (조회 실패, 서버 에러 등)
        else {
          alert(data.message || '초기화에 실패했습니다. 입력하신 정보를 다시 확인해주세요.');
        }
      })
      .catch((error) => {
        console.error('에러:', error)
        alert('서버와 통신 중 문제가 발생했습니다.');
      })
      .finally(() => {
        // 5. 요청이 완전히 끝나면 버튼 상태 원상 복구 (실패했을 때 다시 누를 수 있도록)
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      })
  }
})