// 로그인 상황 확인
const userInfo = sessionStorage.getItem('user')
if (userInfo) window.location.href = '/index.html'

// 로그인
const URLS = 'http://localhost/likelion/users/reset_password.php'
const form = document.getElementById('reset_pw')

form.addEventListener('click', (e) => {
  if (e.target.matches('input[type="submit"]')) {
    e.preventDefault()
    const formData = new FormData(form)
    fetch(URLS, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          window.location.href = './result.html'
        }
      })
      .catch((error) => console.error('에러:', error))
  }
})
