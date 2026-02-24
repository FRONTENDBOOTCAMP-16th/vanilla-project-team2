const URLS = 'http://leedh9276.dothome.co.kr/likelion-vanilla/users/find_id.php'
const form = document.getElementById('find_id')

form.addEventListener('click', (e) => {
  // .matches 대신 .closest를 사용하여 버튼 내부의 텍스트/아이콘을 클릭해도 작동하게 함
  const submitBtn = e.target.closest('.find_id')
  
  if (submitBtn) {
    e.preventDefault()
    
    // 1. 로딩 UI 적용: 버튼 비활성화 및 텍스트 변경
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '조회 중...⏳';
    submitBtn.disabled = true; // 중복 클릭 방지

    const formData = new FormData(form)
    
    fetch(URLS, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.status === 'success') {
          const formContainer = document.querySelector('.form__container')
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
          `
          formContainer.innerHTML = html
        } else {
          // 실패(아이디가 없는 등)에 대한 처리 추가
          alert('일치하는 회원 정보가 없습니다.');
        }
      })
      .catch((error) => {
        console.error('에러:', error)
        alert('서버와 통신 중 문제가 발생했습니다.');
      })
      .finally(() => {
        // 2. 요청이 끝나면(성공이든 실패든) 버튼 상태 원상 복구
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      })
  }
})