let qnaData = [
  {
    post_id: 1,
    board_id: 2, // QnA 게시판 구분용 ID
    UID: 2001,
    nickname: '코딩뉴비',
    subject: 'HTML 레이아웃 질문입니다. <div>가 왜 옆으로 안 붙을까요?',
    contents:
      'flex를 줬는데도 자식 요소들이 세로로만 나옵니다. 어떤 속성을 더 확인해야 하나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-18T09:00:00',
  },
  {
    post_id: 2,
    board_id: 2,
    UID: 2002,
    nickname: '스타일장인',
    subject: 'CSS Grid에서 특정 셀만 크기를 늘리는 방법',
    contents:
      'grid-column을 사용했는데 옆의 셀이랑 겹쳐 보입니다. 해결 방법이 있을까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-17T14:20:00',
  },
  {
    post_id: 3,
    board_id: 2,
    UID: 2003,
    nickname: '제이코수',
    subject: '자바스크립트 비동기 처리가 이해가 안 됩니다.',
    contents:
      'async/await를 썼는데 왜 결과값이 undefined로 나오는지 모르겠어요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-17T11:00:00',
  },
  {
    post_id: 4,
    board_id: 2,
    UID: 2004,
    nickname: '리액트열공',
    subject: 'React useEffect 무한 루프 문제 해결 방법',
    contents:
      '의존성 배열에 값을 넣었는데 계속 리렌더링이 발생합니다. 도와주세요!',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-16T18:30:00',
  },
  {
    post_id: 1,
    board_id: 2, // QnA 게시판 구분용 ID
    UID: 2001,
    nickname: '코딩뉴비',
    subject: 'HTML 레이아웃 질문입니다. <div>가 왜 옆으로 안 붙을까요?',
    contents:
      'flex를 줬는데도 자식 요소들이 세로로만 나옵니다. 어떤 속성을 더 확인해야 하나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-18T09:00:00',
  },
  {
    post_id: 2,
    board_id: 2,
    UID: 2002,
    nickname: '스타일장인',
    subject: 'CSS Grid에서 특정 셀만 크기를 늘리는 방법',
    contents:
      'grid-column을 사용했는데 옆의 셀이랑 겹쳐 보입니다. 해결 방법이 있을까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-17T14:20:00',
  },
  {
    post_id: 3,
    board_id: 2,
    UID: 2003,
    nickname: '제이코수',
    subject: '자바스크립트 비동기 처리가 이해가 안 됩니다.',
    contents:
      'async/await를 썼는데 왜 결과값이 undefined로 나오는지 모르겠어요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-17T11:00:00',
  },
  {
    post_id: 4,
    board_id: 2,
    UID: 2004,
    nickname: '리액트열공',
    subject: 'React useEffect 무한 루프 문제 해결 방법',
    contents:
      '의존성 배열에 값을 넣었는데 계속 리렌더링이 발생합니다. 도와주세요!',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-16T18:30:00',
  },
  {
    post_id: 5,
    board_id: 2,
    UID: 2005,
    nickname: '배포빌런',
    subject: 'Vercel 배포 시 환경변수 설정 오류',
    contents:
      '.env 파일에 있는 값이 배포 환경에서 적용되지 않는데 설정법이 따로 있나요?',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-16T10:15:00',
  },
  {
    post_id: 6,
    board_id: 2,
    UID: 2006,
    nickname: '웹표준수호자',
    subject: '시맨틱 태그 사용 시 접근성 점수 높이는 팁',
    contents:
      'section과 article을 구분해서 사용하면 검색 엔진 최적화에 진짜 도움이 되나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-15T22:00:00',
  },
  {
    post_id: 7,
    board_id: 2,
    UID: 2007,
    nickname: '애니메이션왕',
    subject: 'CSS transition이 특정 브라우저에서 안 먹힙니다.',
    contents:
      '사파리 브라우저에서만 애니메이션이 뚝뚝 끊기는데 벤더 프리픽스 문제일까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-15T15:45:00',
  },
  {
    post_id: 8,
    board_id: 2,
    UID: 1001, // 자습방 트렌드세터가 여기선 질문자로!
    nickname: '트렌드세터',
    subject: '2026년 웹 개발 트렌드 중 하나인 Qwik 라이브러리 써보신 분?',
    contents: 'Hydration 문제를 어떻게 해결했는지 궁금해서 질문 올립니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-14T13:00:00',
  },
  {
    post_id: 9,
    board_id: 2,
    UID: 2009,
    nickname: '컴포넌트덕후',
    subject: 'React 고차 컴포넌트(HOC)와 Hook 중 어떤 게 대세인가요?',
    contents: '기존 프로젝트 코드를 리팩토링하려고 하는데 추천 부탁드립니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-13T19:00:00',
  },
  {
    post_id: 10,
    board_id: 2,
    UID: 2010,
    nickname: '질문봇',
    subject: 'VS Code 단축키 설정이 초기화되었습니다.',
    contents:
      '업데이트 이후에 단축키가 다 바뀌었는데 이전 설정으로 되돌리는 법 아시나요?',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-12T08:30:00',
  },
  {
    post_id: 11,
    board_id: 2,
    UID: 2011,
    nickname: 'DOM전문가',
    subject: 'DOM 조작 시 innerHTML보다 textContent를 권장하는 이유',
    contents: '성능 차이가 크다고 들었는데 구체적인 원인이 궁금합니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-11T16:00:00',
  },
  {
    post_id: 12,
    board_id: 2,
    UID: 2012,
    nickname: '마크업의신',
    subject: '웹 접근성 검사 도구 추천 부탁드립니다.',
    contents: 'Lighthouse 외에 실무에서 많이 쓰는 무료 툴이 있을까요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-10T21:45:00',
  },
  {
    post_id: 13,
    board_id: 2,
    UID: 2013,
    nickname: '퍼블리셔킴',
    subject: '태그(Tag) 디자인 시 글자 수에 따라 배경이 깨져요.',
    contents:
      'JavaScript처럼 긴 단어는 배경 밖으로 글자가 나갑니다. width: auto를 써야 할까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-18T10:30:00',
  },
  {
    post_id: 14,
    board_id: 2,
    UID: 2014,
    nickname: '접근성열공',
    subject: '스크린 리더에서 SVG 아이콘을 안 읽게 하고 싶습니다.',
    contents:
      'aria-hidden="true"를 svg 태그에 직접 넣으면 되나요? 아니면 부모 div에 넣어야 하나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-18T11:15:00',
  },
  {
    post_id: 15,
    board_id: 2,
    UID: 2015,
    nickname: '상태관리자',
    subject: 'React Context API와 Redux 중 어떤 상황에 뭘 쓸까요?',
    contents:
      '단순한 테마 변경 기능인데 Redux까지 쓰는 건 과한 것 같아 고민입니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-18T09:45:00',
  },
  {
    post_id: 16,
    board_id: 2,
    UID: 2016,
    nickname: '모던JS',
    subject: 'ES14 신기능 중에서 실무에서 바로 쓸만한 게 있을까요?',
    contents:
      '배열 메서드 중심으로 변화가 많다던데, 브라우저 호환성이 걱정되네요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-17T17:20:00',
  },
  {
    post_id: 17,
    board_id: 2,
    UID: 2017,
    nickname: '구조설계사',
    subject: 'main-category__button에 aria-current를 꼭 써야 하나요?',
    contents:
      '현재 선택된 탭을 시각장애인 분들이 알게 하려면 클래스만으로는 부족한가요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-17T13:10:00',
  },
  {
    post_id: 18,
    board_id: 2,
    UID: 2018,
    nickname: '그리드고수',
    subject: 'grid-column: 1 / -1 속성이 안 먹는 이유',
    contents:
      '부모 컨테이너가 grid가 맞는데 왜 자식 요소가 한 칸만 차지할까요? 오타일까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-16T21:00:00',
  },
  {
    post_id: 19,
    board_id: 2,
    UID: 2019,
    nickname: '넥스트입문',
    subject: 'Next.js App Router에서 클라이언트 컴포넌트 선언 기준',
    contents:
      '모든 파일 상단에 "use client"를 붙이는 게 맞는 건가요? 성능 이슈가 궁금합니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-16T15:40:00',
  },
  {
    post_id: 20,
    board_id: 2,
    UID: 2020,
    nickname: '최적화왕',
    subject: '검색 기능 구현 시 디바운싱(Debouncing) 적용 질문',
    contents:
      'input 이벤트마다 필터링을 돌리니 글자 수가 많을 때 버벅입니다. 팁 부탁드려요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-15T19:50:00',
  },
  {
    post_id: 21,
    board_id: 2,
    UID: 2021,
    nickname: '깃린이',
    subject: 'git commit --amend로 이전 커밋 메시지 수정하기',
    contents: '이미 푸시한 뒤에 메시지를 고치면 팀원들한테 피해가 가나요?',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-15T11:00:00',
  },
  {
    post_id: 22,
    board_id: 2,
    UID: 2022,
    nickname: '레이아웃마스터',
    subject: 'scrollbar-gutter: stable 속성의 장점이 뭔가요?',
    contents:
      '스크롤이 생길 때 화면이 옆으로 덜컥거리는 걸 막아준다는데 실제 체감이 큰가요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-14T23:30:00',
  },
  {
    post_id: 1,
    board_id: 2, // QnA 게시판 구분용 ID
    UID: 2001,
    nickname: '코딩뉴비',
    subject: 'HTML 레이아웃 질문입니다. <div>가 왜 옆으로 안 붙을까요?',
    contents:
      'flex를 줬는데도 자식 요소들이 세로로만 나옵니다. 어떤 속성을 더 확인해야 하나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-18T09:00:00',
  },
  {
    post_id: 2,
    board_id: 2,
    UID: 2002,
    nickname: '스타일장인',
    subject: 'CSS Grid에서 특정 셀만 크기를 늘리는 방법',
    contents:
      'grid-column을 사용했는데 옆의 셀이랑 겹쳐 보입니다. 해결 방법이 있을까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-17T14:20:00',
  },
  {
    post_id: 3,
    board_id: 2,
    UID: 2003,
    nickname: '제이코수',
    subject: '자바스크립트 비동기 처리가 이해가 안 됩니다.',
    contents:
      'async/await를 썼는데 왜 결과값이 undefined로 나오는지 모르겠어요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-17T11:00:00',
  },
  {
    post_id: 4,
    board_id: 2,
    UID: 2004,
    nickname: '리액트열공',
    subject: 'React useEffect 무한 루프 문제 해결 방법',
    contents:
      '의존성 배열에 값을 넣었는데 계속 리렌더링이 발생합니다. 도와주세요!',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-16T18:30:00',
  },
  {
    post_id: 5,
    board_id: 2,
    UID: 2005,
    nickname: '배포빌런',
    subject: 'Vercel 배포 시 환경변수 설정 오류',
    contents:
      '.env 파일에 있는 값이 배포 환경에서 적용되지 않는데 설정법이 따로 있나요?',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-16T10:15:00',
  },
  {
    post_id: 6,
    board_id: 2,
    UID: 2006,
    nickname: '웹표준수호자',
    subject: '시맨틱 태그 사용 시 접근성 점수 높이는 팁',
    contents:
      'section과 article을 구분해서 사용하면 검색 엔진 최적화에 진짜 도움이 되나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-15T22:00:00',
  },
  {
    post_id: 7,
    board_id: 2,
    UID: 2007,
    nickname: '애니메이션왕',
    subject: 'CSS transition이 특정 브라우저에서 안 먹힙니다.',
    contents:
      '사파리 브라우저에서만 애니메이션이 뚝뚝 끊기는데 벤더 프리픽스 문제일까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-15T15:45:00',
  },
  {
    post_id: 8,
    board_id: 2,
    UID: 1001, // 자습방 트렌드세터가 여기선 질문자로!
    nickname: '트렌드세터',
    subject: '2026년 웹 개발 트렌드 중 하나인 Qwik 라이브러리 써보신 분?',
    contents: 'Hydration 문제를 어떻게 해결했는지 궁금해서 질문 올립니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-14T13:00:00',
  },
  {
    post_id: 9,
    board_id: 2,
    UID: 2009,
    nickname: '컴포넌트덕후',
    subject: 'React 고차 컴포넌트(HOC)와 Hook 중 어떤 게 대세인가요?',
    contents: '기존 프로젝트 코드를 리팩토링하려고 하는데 추천 부탁드립니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-13T19:00:00',
  },
  {
    post_id: 10,
    board_id: 2,
    UID: 2010,
    nickname: '질문봇',
    subject: 'VS Code 단축키 설정이 초기화되었습니다.',
    contents:
      '업데이트 이후에 단축키가 다 바뀌었는데 이전 설정으로 되돌리는 법 아시나요?',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-12T08:30:00',
  },
  {
    post_id: 11,
    board_id: 2,
    UID: 2011,
    nickname: 'DOM전문가',
    subject: 'DOM 조작 시 innerHTML보다 textContent를 권장하는 이유',
    contents: '성능 차이가 크다고 들었는데 구체적인 원인이 궁금합니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-11T16:00:00',
  },
  {
    post_id: 12,
    board_id: 2,
    UID: 2012,
    nickname: '마크업의신',
    subject: '웹 접근성 검사 도구 추천 부탁드립니다.',
    contents: 'Lighthouse 외에 실무에서 많이 쓰는 무료 툴이 있을까요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-10T21:45:00',
  },
  {
    post_id: 13,
    board_id: 2,
    UID: 2013,
    nickname: '퍼블리셔킴',
    subject: '태그(Tag) 디자인 시 글자 수에 따라 배경이 깨져요.',
    contents:
      'JavaScript처럼 긴 단어는 배경 밖으로 글자가 나갑니다. width: auto를 써야 할까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-18T10:30:00',
  },
  {
    post_id: 14,
    board_id: 2,
    UID: 2014,
    nickname: '접근성열공',
    subject: '스크린 리더에서 SVG 아이콘을 안 읽게 하고 싶습니다.',
    contents:
      'aria-hidden="true"를 svg 태그에 직접 넣으면 되나요? 아니면 부모 div에 넣어야 하나요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-18T11:15:00',
  },
  {
    post_id: 15,
    board_id: 2,
    UID: 2015,
    nickname: '상태관리자',
    subject: 'React Context API와 Redux 중 어떤 상황에 뭘 쓸까요?',
    contents:
      '단순한 테마 변경 기능인데 Redux까지 쓰는 건 과한 것 같아 고민입니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-18T09:45:00',
  },
  {
    post_id: 16,
    board_id: 2,
    UID: 2016,
    nickname: '모던JS',
    subject: 'ES14 신기능 중에서 실무에서 바로 쓸만한 게 있을까요?',
    contents:
      '배열 메서드 중심으로 변화가 많다던데, 브라우저 호환성이 걱정되네요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-17T17:20:00',
  },
  {
    post_id: 17,
    board_id: 2,
    UID: 2017,
    nickname: '구조설계사',
    subject: 'main-category__button에 aria-current를 꼭 써야 하나요?',
    contents:
      '현재 선택된 탭을 시각장애인 분들이 알게 하려면 클래스만으로는 부족한가요?',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-17T13:10:00',
  },
  {
    post_id: 18,
    board_id: 2,
    UID: 2018,
    nickname: '그리드고수',
    subject: 'grid-column: 1 / -1 속성이 안 먹는 이유',
    contents:
      '부모 컨테이너가 grid가 맞는데 왜 자식 요소가 한 칸만 차지할까요? 오타일까요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-16T21:00:00',
  },
  {
    post_id: 19,
    board_id: 2,
    UID: 2019,
    nickname: '넥스트입문',
    subject: 'Next.js App Router에서 클라이언트 컴포넌트 선언 기준',
    contents:
      '모든 파일 상단에 "use client"를 붙이는 게 맞는 건가요? 성능 이슈가 궁금합니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-16T15:40:00',
  },
  {
    post_id: 20,
    board_id: 2,
    UID: 2020,
    nickname: '최적화왕',
    subject: '검색 기능 구현 시 디바운싱(Debouncing) 적용 질문',
    contents:
      'input 이벤트마다 필터링을 돌리니 글자 수가 많을 때 버벅입니다. 팁 부탁드려요.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-15T19:50:00',
  },
  {
    post_id: 21,
    board_id: 2,
    UID: 2021,
    nickname: '깃린이',
    subject: 'git commit --amend로 이전 커밋 메시지 수정하기',
    contents: '이미 푸시한 뒤에 메시지를 고치면 팀원들한테 피해가 가나요?',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-15T11:00:00',
  },
  {
    post_id: 22,
    board_id: 2,
    UID: 2022,
    nickname: '레이아웃마스터',
    subject: 'scrollbar-gutter: stable 속성의 장점이 뭔가요?',
    contents:
      '스크롤이 생길 때 화면이 옆으로 덜컥거리는 걸 막아준다는데 실제 체감이 큰가요?',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-14T23:30:00',
  },
]

const itemsPerPage = 8
const pageCount = 5
let currentPage = 1
let currentDisplayData = qnaData
const qnaPostUl = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector(
  '.pagination__control--next-group',
)
const searchInput = document.querySelector('#main-search__item')

const timeForToday = function (value) {
  const today = new Date()
  const timeValue = new Date(value)
  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60,
  )

  if (betweenTime < 1) return '방금전'
  if (betweenTime < 60) return `${betweenTime}분전`
  const betweenTimeHour = Math.floor(betweenTime / 60)
  if (betweenTimeHour < 24) return `${betweenTimeHour}시간전`
  const betweenTimeDay = Math.floor(betweenTimeHour / 24)
  if (betweenTimeDay < 365) return `${betweenTimeDay}일전`
  return `${Math.floor(betweenTimeDay / 365)}년전`
}
const renderPosts = function (page, data) {
  if (data.length === 0) {
    qnaPostUl.innerHTML = `
    <li class="main-post__no-result">
    <p>검색 결과가 없습니다.</p>
    </li>
    `
    return
  }
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const sliceData = data.slice(startIndex, endIndex)

  const qnaElementList = sliceData
    .map(
      (post) => `
  <li class="main-post__item" data-category="${post.typeIndex}" data-id="${post.post_id}">
      <a href="#" class="main-post__inner">
        <span class="main-post__tag">${post.type}</span>
        <div class="main-post__group">
          <h3 class="main-post__heading">${post.subject}</h3>
          <p class="main-post__text">${post.contents}</p>
        </div>
        <div class="main-post__meta-box">
          <span class="main-post__author-text">by ${post.nickname}</span>
          <span class="main-post__date">${timeForToday(post.create_date)}</span>
        </div>
      </a>
    </li>
  `,
    )
    .join('')

  qnaPostUl.innerHTML = qnaElementList
}

const setupPaginationEvents = function (data) {
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((Btn) => {
    Btn.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      updateUI(data)
    })
  })
}

const renderPagination = function (data) {
  let htmlString = ''
  const currentTotalPage = Math.ceil(data.length / itemsPerPage)
  const currentGroup = Math.ceil(currentPage / pageCount)
  const totalGroup = Math.ceil(currentTotalPage / pageCount)

  let startPage = (currentGroup - 1) * pageCount + 1
  let endPage = Math.min(startPage + pageCount - 1, currentTotalPage)

  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === currentPage ? 'is-active' : ''
    htmlString += `
      <li class="pagination__item">
        <button type="button" class="pagination__link ${activeClass}">${i}</button>
      </li>
    `
  }
  paginationList.innerHTML = htmlString

  firstButton.classList.toggle('hidden', currentGroup === 1)
  nextGroupButton.classList.toggle(
    'hidden',
    currentGroup === totalGroup || currentTotalPage === 0,
  )

  setupPaginationEvents(data)
}

const updateUI = function (data) {
  currentDisplayData = data

  renderPosts(currentPage, currentDisplayData)
  renderPagination(data)
}

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase().trim()
  const searchedData = qnaData.filter(({ subject }) =>
    subject.toLowerCase().includes(keyword),
  )
  currentPage = 1
  updateUI(searchedData)
})

nextGroupButton.addEventListener('click', () => {
  const currentTotalPage = Math.ceil(currentDisplayData.length / itemsPerPage)
  const currentGroup = Math.ceil(currentPage / pageCount)
  currentPage = Math.min(currentGroup * pageCount + 1, currentTotalPage)

  updateUI(currentDisplayData)
})

firstButton.addEventListener('click', () => {
  const currentGroup = Math.ceil(currentPage / pageCount)

  currentPage = (currentGroup - 1) * pageCount

  updateUI(currentDisplayData)
})

prevButton.addEventListener('click', () => {
  currentPage = Math.max(currentPage - 1, 1)
  updateUI(currentDisplayData)
})

nextButton.addEventListener('click', () => {
  const currentTotalPage = Math.ceil(currentDisplayData.length / itemsPerPage)
  currentPage = Math.min(currentPage + 1, currentTotalPage)
  updateUI(currentDisplayData)
})

updateUI(qnaData)

// 서버 연결
async function init() {
  try {
    const response = await fetch('http://localhost:4000/posts')
    if (!response.ok) throw new Error('데이터 불러오기 실패')

    // const serverPosts = await response.json()
    // 최신순 정렬
    const serverPosts = (await response.json()).sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )

    // 자습방 글만 필터
    const qnaPosts = serverPosts.filter((item) => item.board_id === 2)

    qnaData = qnaPosts.map((post) => ({
      post_id: post.post_id,
      board_id: post.board_id, // 게시판 임시값
      UID: post.UID, // 유저 아이디 임시값
      nickname: post.nickname || '사용자',
      subject: post.subject,
      contents: post.contents,
      type: post.type,
      typeIndex: post.typeIndex, // 카테고리 번호 필드
      create_date: post.create_date,
    }))

    updateUI(qnaData)
  } catch (error) {
    console.error(error)
    updateUI(qnaData)
  }
}

init()

qnaPostUl.addEventListener('click', (e) => {
  // 템플릿 리터럴에 쓰인 a href = # 로 페이지 이동X -> preventDefault() 추가
  e.preventDefault()

  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
    localStorage.setItem('selectedBoardId', 2)

  // 읽기 페이지 이동
  location.href = '../readpost/index.html'
})
