# 중간 점검 피드백 사항

- ⭐ 붙은게 중요한 거라서 내일까지 꼭 수정하기
  그 외는 각자 개인 스케줄 조절해서 코드 수정하세요

### 참고 링크

https://www.notion.so/euid/311b02dcf1d8802497cdef3bd4580e10

### 1. DS 파일삭제 ⭐

- 맥사용자들이 git 사용하면 자동으로 git에 올라가는 거
- 삭제 후에 .gitignore 파일에 해당 내용 추가하기

담당 : 사민재

### 2. 스타일 파일 사용하지 않는 파일 삭제 ⭐ ✅

- reset css가 중복 적용됨

담당 : 김효경

### 3. 컨벤션에 맞게 HTML & CSS 정리 ⭐

- 404, user_form class 이름 재정의 및 css 컨벤션 체크하기

담당 : 김효경, 이동헌

### 4. db. json 파일 삭제 ⭐ ✅

- 가상 데이터 뿌려서 테스트하던 db 다 삭제하기

담당 : 김효경, 사민재

### 5. 사용하지 않는 파일 삭제 ⭐

- 사용하지 않는 파일 삭제
- 불필요한 페이지 삭제하기

담당 : 김한결

### 6. 404.html 위치 체크 후 삭제 ⭐

- 빌드 구조 파악 후에 파일 위치 재설정

담당 : 김한결

### 7. main.js ⭐

```
// 모든 걸 멈추지 말고 필요한 것만 기다리게 하기
async function init() {
  // 레이아웃과 상관없는 일은 즉시 실행
  initByPage()

  // 레이아웃이 로드된 후에만 할 수 있는 일들을 묶어주기
  await loadLayout()

  // 이제 헤더/푸터가 확실히 있으니 안심하고 실행
  setActiveNav()
  controlAuthUI()
  bindLogout()
}

init()
```

- 호출 방식 정리하기

담당 : 김한결

### 8. JWT.js ⭐

```
// 환경 변수 활용으로 보안성 강화
const AUTH_ENDPOINT = import.meta.env.VITE_API_AUTH_ENDPOINT
const REFRESH_ENDPOINT = import.meta.env.VITE_API_REFRESH_ENDPOINT

const MAX_RETRIES = 1 // 무한 루프 방지를 위한 최대 재시도 횟수

/**
 * 사용자 토큰 유효성 검사 및 자동 갱신 로직
 * @param {number} retryCount - 재귀 호출 횟수 제한을 위한 카운터
 * @returns {Promise<Object|boolean>} 유저 데이터 객체 또는 실패 시 false
 */
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
        Authorization: `Bearer ${accessToken}`
      }
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
```

- 환경변수 설정하기
- 환경변수 설정 후에 팀원과 공유하기
- 주석부분 반환값 일관되게 정리하기 (현재 주석이랑 코드랑 내용이 다름)
- 재귀로직 루프값 조절 > 토큰 값이 현재 무한루프에 빠질 수 있으니 추가 해결 필요
- 평균 3회 정도로 수정

담당 : 이동헌

### 9. logout.js ⭐

```
// 환경 변수 활용 및 함수 내보내기
const LOGOUT_ENDPOINT = import.meta.env.VITE_API_LOGOUT_ENDPOINT

const logoutButton = document.querySelector('.logout-button')

// 로그아웃 버튼이 있을 때만 이벤트 리스너 연결
if (logoutButton) {
  logoutButton.addEventListener('click', handleLogout)
}

export async function handleLogout() {
  const refreshToken = localStorage.getItem('refresh_token')

  // 1. 서버에 로그아웃 알림 (비동기)
  try {
    if (refreshToken) {
      await fetch(LOGOUT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      })
    }
  } catch (error) {
    // 서버 통신 실패 시 로그만 남기고 사용자 로그아웃은 계속 진행
    console.warn('서버 로그아웃 처리 실패:', error)
  } finally {
      // 2. 로컬 데이터 강제 삭제 (서버 응답과 무관하게 실행)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')

      alert('로그아웃 되었습니다.')

      // 3. 페이지 이동 (예: 로그인 페이지나 메인으로)
      window.location.href = '/login.html'
  }
}
```

- 로그아웃 페이지 수정 보안 향상
- 추후에 해당 페이지 header에서 사용 예정
- 200, 성공페이지만 구현되어 있음

담당 : 이동헌

### 10. header, footer 컴포넌트 분류하기 ⭐

- 분리하기
- 분리하고 구조 설정 후에 logout. js 불러오기

담당 : 김한결

### 11. mypage.js ⭐

```
// 데이터 가공 전담 (비즈니스 로직)
const formatUserData = (data) => ({
  nickname: data.user_nickname,
  date: data.create_date.split(' ')[0],
  grade: ['초급 개발자', '중급 개발자', '고급 개발자'][data.user_grade] ?? '???',
  profilePath: data.user_profile
    ? `http://leedh9276.dothome.co.kr/likelion-vanilla/users/uploads/profile/${data.user_profile}`
    : null
})

// 컴포넌트 생성 전담 (UI 로직)
const createProfileHTML = (path, nickname) => {
  if (path) return `<img src="${path}" alt="프로필">`
  return `<p>${nickname.substring(0, 1)}</p>`
}

// 요소를 미리 캐싱해두거나 상단에서 한 번만 선택하는 것이 성능상 좋습니다.
const nodes = {
  name: document.querySelector('.user'),
  profile: document.querySelector('.profile_thumb'),
  grade: document.querySelector('.expert'),
  date: document.querySelector('.create-date span')
}

// 메인 렌더링 전담 (오케스트레이션)
export function renderMyPage(data) {
  if (!data) return

  const user = formatUserData(data)

  nodes.name.textContent = user.nickname
  nodes.grade.textContent = user.grade
  nodes.date.textContent = user.date
  nodes.profile.innerHTML = createProfileHTML(user.profilePath, user.nickname)
}
```

- 단일 책임
  원칙 (SRP) 함수나 클래스가 단 하나의 역할만 수행하는가?
  (예: UI 렌더링 함수 내에 API 호출 로직이 섞여 있지는 않은가?)
  해당 내용 체크하고 화면 로직이랑 호출 로직이랑 분류하기

담당 : 이동헌

### 12. date.js ⭐

위 내용과 상동

- 네트워크 호출하는 방식 변경하기 async-await
  담당 : 이동헌

### 13. Readme.md ⭐

- 문제해결 방식
- 배포 방식
  등 프로젝트와 관련 있는 내용 추가로 등록하기

담당 : 김한결

### 14. api 호출 반복 처리

- 코드의 중복성 줄이기
- 공통함수 만들어서 관리하기

담당 : 김효경, 사민재

### 15. 학습 경험이랑 스토리텔링 준비하기

담당 : 김한결, 김효경

### 🏷️논의 사항

1. bun lock 파일, package 파일 통일하기
2. 환경변수 처리하기
3. 서버응답과 상관없이 로컬 데이터 삭제하기
4. 코드 품질향상을 하기
