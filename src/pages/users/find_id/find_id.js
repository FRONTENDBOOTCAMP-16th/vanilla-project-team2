import { checkToken } from '../../../api/JWT.js'

async function initMyPage() {
  const fetchedData = await checkToken()
  
  if (fetchedData) {
    alert('이미 로그인하셨습니다.')
    window.location.href = '/src/index.html'
  }
}

// 로그인
const URLS = 'http://localhost/likelion/users/find_id.php'
const form = document.getElementById('find_id')

form.addEventListener('click', (e) => {
  if (e.target.matches('.find_id')) {
    e.preventDefault()
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
        }
      })
      .catch((error) => console.error('에러:', error))
  }
})
