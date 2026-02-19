import { checkToken } from '../../../api/JWT.js'

async function initMyPage() {
  const fetchedData = await checkToken()
  
  if (fetchedData) {
    alert('이미 로그인하셨습니다.')
    window.location.href = '/src/index.html'
  }
}

initMyPage()


// 로그인
const URLS = 'http://localhost/likelion/users/reset_password.php'
const form = document.getElementById('reset_pw')

form.addEventListener('click', (e) => {
  if (e.target.matches('.reset_password')) {
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
      .catch((error) => console.error('에러:', error))
  }
})
