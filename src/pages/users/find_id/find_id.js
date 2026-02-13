// 로그인 상황 확인
const userInfo = sessionStorage.getItem('user')
if (userInfo) window.location.href = '/index.html'

// 로그인
const URLS = 'http://localhost/likelion/users/signup.php'
const form = document.getElementById('signup')

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
        console.log('서버 응답:', data)
        if (data.status === 'success') {
          alert('가입 완료!')
        }
      })
      .catch((error) => console.error('에러:', error))
  }
})
