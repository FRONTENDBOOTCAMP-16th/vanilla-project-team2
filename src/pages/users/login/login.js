
// 로그인
const URLS = 'http://localhost/likelion/users/login.php'

// 로그인 상황 확인
const userInfo = sessionStorage.getItem('user')
if (userInfo) window.location.href = '/index.html'


// 변수 설정
const loginButton = document.querySelector('.login__button')
const form = document.getElementById('login')

// 로그인 버튼 로직
loginButton.addEventListener('click', (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  fetch(URLS, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.access_token)
      sessionStorage.setItem('user', data.user_id)
      // window.location.href = "/src/pages/mypage/index.html";
    })
    .catch((error) => console.warn('에러: ', error))
})
