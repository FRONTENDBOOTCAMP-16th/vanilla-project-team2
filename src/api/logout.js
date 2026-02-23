const logoutButton = document.querySelector('.logout-button')

logoutButton.addEventListener('click', () => {
  logout()
})


function logout() {
  const refreshToken = localStorage.getItem('refresh_token')
  fetch('http://leedh9276.dothome.co.kr/likelion-vanilla/users/logout.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  })
  .then((data) => {
    console.log(data)
    if (data.status === 200) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      alert('로그아웃 되셨습니다.')
    } 
  })
  .catch((error) => console.warn(error))
}

