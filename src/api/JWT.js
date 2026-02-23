// 1. 이 JS를 부릅니다.
// 2. checkToken() 함수를 실행.
// 3. true / false 로 반환한다.
// 4. 그 뒤에 if문으로 실행할 것.

export async function checkToken() {
  const accessToken = localStorage.getItem('access_token')

  // 토큰이 없으면 실패(false)
  if (!accessToken) {
    console.warn('액세스 토큰이 없습니다.')
    return false
  }

  try {
    const response = await fetch('http://leedh9276.dothome.co.kr/likelion-vanilla/users/auth.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    
    if (data.status === 'success') {
      console.log('인증 및 데이터 로드 성공!')
      // ★ 변경됨: true 대신 서버가 준 user 데이터 객체를 통째로 리턴합니다!
      return data.data 
    } else if (data.status === 'expired') {
      console.warn('토큰 만료 감지. 갱신을 시도합니다...')

      // 토큰 갱신 시도
      const refreshSuccess = await refreshAccessToken()

      // 갱신 성공하면 다시 checkToken 재귀 호출 (결과값인 true/false를 그대로 리턴)
      if (refreshSuccess) {
        return await checkToken()
      } else {
        return false
      }
    } else {
      console.error('인증 오류:', data.message)
      return false // 그 외 실패는 false
    }
  } catch (err) {
    console.error('Fetch 에러:', err)
    return false // 에러 발생 시 false
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) {
    console.error('리프레시 토큰이 없습니다. 다시 로그인하세요.')
    return false
  }

  try {
    const response = await fetch(
      'http://leedh9276.dothome.co.kr/likelion-vanilla/users/refresh.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
    )

    const data = await response.json()

    if (data.status === 'success') {
      console.log('토큰 갱신 성공!')
      localStorage.setItem('access_token', data.access_token)

      // 리프레시 토큰도 갱신된다면 저장 (백엔드 로직에 따라 다름)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }

      return true
    } else {
      console.error('토큰 갱신 실패:', data.message)
      localStorage.clear()
      // window.location.href = '/src/pages/users/login/index.html'
      return false
    }
  } catch (err) {
    console.error('Refresh Fetch 에러:', err)
    return false
  }
}
