//
const AUTH_ENDPOINT = import.meta.env.VITE_API_AUTH_ENDPOINT
const REFRESH_ENDPOINT = import.meta.env.VITE_API_REFRESH_ENDPOINT
const MAX_RETRIES = 3

export async function checkToken(retryCount = 0) {
  const accessToken = localStorage.getItem('access_token')

  if (!accessToken) {
    console.warn('액세스 토큰이 없습니다.')
    return false
  }

  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // HTTP 상태 코드 확인 (네트워크는 성공했으나 응답이 에러인 경우)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('서버 응답 오류:', errorText)
      return false
    }

    const data = await response.json()

    // 1. 인증 성공: 유저 데이터 반환
    if (data.status === 'success') {
      console.log('인증 및 데이터 로드 성공!')
      return data.data
    }

    // 2. 토큰 만료 시: 재시도 로직 수행
    if (data.status === 'expired') {
      if (retryCount >= MAX_RETRIES) {
        console.error('최대 재시도 횟수를 초과했습니다. 다시 로그인해 주세요.')
        localStorage.clear()
        return false
      }

      console.warn(`토큰 만료 감지 (시도 ${retryCount + 1}). 갱신 시도 중...`)
      const refreshSuccess = await refreshAccessToken()

      if (refreshSuccess) {
        // 성공 시 횟수를 증가시켜 재귀 호출
        return await checkToken(retryCount + 1)
      }
    }

    // 3. 기타 실패 (invalid 등)
    console.error('인증 실패:', data.message)
    return false
  } catch (err) {
    console.error('네트워크 또는 데이터 파싱 에러:', err)
    return false
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) {
    console.error('리프레시 토큰이 없습니다. 다시 로그인하세요.')
    return false
  }

  try {
    const response = await fetch(REFRESH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

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
      return false
    }
  } catch (err) {
    console.error('Refresh Fetch 에러:', err)
    return false
  }
}
