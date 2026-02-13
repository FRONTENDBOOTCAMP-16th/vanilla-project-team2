// 1. 단순 문자열 가져오기 ('test1')

const userId = sessionStorage.getItem('user')
const URLS = `http://localhost/likelion/users/check.php`
const sendData = {
  user_id: userId,
}

// 값이 없으면 로그인 페이지로 리다이렉트
// if (!userId) {
//   window.location.href = '/src/pages/users/login/index.html'
// }

function myPage() {
  fetch(URLS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendData),
  })
    .then((res) => res.json())
    .then((response) => {

      const result = response.data
      console.log(result)

      // const profile = document.querySelector('.user__profile > img')
      // const profileTag = document.querySelector('.user__profile > figcaption')
      // const userName = document.querySelector('.user__name')
      // const userPhone = document.querySelector('.user__phone')
      // profile.setAttribute(
      //   'src',
      //   `http://localhost/likelion/users/uploads/profile/${result.user_profile}`,
      // )
      // profileTag.textContent = result.user_nickname
      // userName.textContent = result.user_nickname
      // userPhone.textContent = result.user_phone
    })
    .catch((error) => console.error('에러:', error))
}

myPage()
