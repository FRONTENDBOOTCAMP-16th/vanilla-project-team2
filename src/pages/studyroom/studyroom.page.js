let postData = [
  {
    post_id: 12,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '2026년 웹 개발 트렌드 총정리: 우리가 준비해야 할 것들',
    contents:
      '프론트엔드부터 백엔드까지, 올해 가장 주목받는 기술 스택과 변화하는 개발 문화를 살펴봅니다.',
    type: 'JavaScript', // '전체'에서 'JavaScript'로 변경
    typeIndex: 3,
    create_date: '2015-02-15T15:45:00',
  },
  {
    post_id: 11,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '시맨틱 마크업의 정석: 검색 엔진이 좋아하는 구조 짜기',
    contents:
      'div만 쓰는 코딩은 이제 그만! 시맨틱 태그를 적재적소에 활용하여 접근성과 SEO를 동시에 잡아보세요.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-15T12:30:00',
  },
  {
    post_id: 10,
    board_id: 1,
    UID: 2055,
    nickname: '스타일가이',
    subject: 'Flexbox와 Grid, 더 이상 헷갈리지 마세요! (실전 예제 포함)',
    contents:
      '복잡한 레이아웃도 5줄 이내로 끝내는 핵심 속성들을 정리했습니다. 반응형 웹의 기초를 다져봅시다.',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-15T09:00:00',
  },
  {
    post_id: 9,
    board_id: 1,
    UID: 3012,
    nickname: '제이에스고수',
    subject: '자바스크립트 ES14 신기능 미리보기: 더 간결해진 문법들',
    contents:
      '배열 메서드부터 비동기 처리까지, 새롭게 추가된 자바스크립트 최신 문법들을 실전 코드로 익혀봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-14T20:00:00',
  },
  {
    post_id: 8,
    board_id: 1,
    UID: 1088,
    nickname: '리액트러버',
    subject: 'React Server Components 도입 전 꼭 알아야 할 것들',
    contents:
      '리액트의 패러다임이 변하고 있습니다. 서버 컴포넌트의 개념과 효율적인 상태 관리 전략을 다룹니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-14T10:00:00',
  },
  {
    post_id: 7,
    board_id: 1,
    UID: 4001,
    nickname: '팀리더K',
    subject: 'Git을 활용한 효율적인 코드 리뷰 프로세스 만들기',
    contents:
      '팀원들과 함께 성장하는 코드 리뷰 문화! Pull Request 템플릿과 브랜치 관리 노하우를 공유합니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-13T14:00:00',
  },
  {
    post_id: 6,
    board_id: 1,
    UID: 5022,
    nickname: '넥스트마스터',
    subject: 'Next.js 15 버전 업데이트 핵심 내용 정리',
    contents:
      '성능 최적화와 새로운 라우팅 시스템 등, 이번 업데이트에서 가장 중요한 변화 5가지를 뽑아봤습니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-12T09:30:00',
  },
  {
    post_id: 5,
    board_id: 1,
    UID: 1011,
    nickname: '알고팡',
    subject: '입문자를 위한 자바스크립트 알고리즘 기초 문제 10선',
    contents:
      '코딩 테스트의 시작! 가장 기본이 되는 10가지 알고리즘 문제를 자바스크립트로 풀어봅시다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-11T16:20:00',
  },
  {
    post_id: 4,
    board_id: 1,
    UID: 2033,
    nickname: '타입스크립터',
    subject: 'TypeScript 제네릭(Generic) 완벽 가이드',
    contents:
      'any 타입은 이제 그만! 제네릭을 활용하여 재사용성 높고 안전한 함수를 만드는 방법을 알아봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-10T11:00:00',
  },
  {
    post_id: 3,
    board_id: 1,
    UID: 4055,
    nickname: '뷰장인',
    subject: 'Vue 3 Composition API 실전 활용법',
    contents:
      'Options API와 비교하여 Composition API가 가지는 장점과 실무 적용 사례를 살펴봅니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-09T14:45:00',
  },
  {
    post_id: 2,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '웹 접근성(A11y) 향상을 위한 ARIA 속성 가이드',
    contents:
      '스크린 리더 사용자를 배려하는 착한 웹사이트 만들기. 꼭 알아야 할 WAI-ARIA 속성들을 정리했습니다.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-08T10:10:00',
  },
  {
    post_id: 1,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '자습방 게시판 오픈을 환영합니다!',
    contents:
      '앞으로 유익한 개발 정보와 꿀팁들을 많이 공유해 주세요. 모두 파이팅입니다!',
    type: '기타', // '전체'에서 '기타'로 변경
    typeIndex: 5,
    create_date: '2026-02-01T09:00:00',
  },
  {
    post_id: 12,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '2026년 웹 개발 트렌드 총정리: 우리가 준비해야 할 것들',
    contents:
      '프론트엔드부터 백엔드까지, 올해 가장 주목받는 기술 스택과 변화하는 개발 문화를 살펴봅니다.',
    type: 'JavaScript', // '전체'에서 'JavaScript'로 변경
    typeIndex: 3,
    create_date: '2026-02-15T15:45:00',
  },
  {
    post_id: 11,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '시맨틱 마크업의 정석: 검색 엔진이 좋아하는 구조 짜기',
    contents:
      'div만 쓰는 코딩은 이제 그만! 시맨틱 태그를 적재적소에 활용하여 접근성과 SEO를 동시에 잡아보세요.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-15T12:30:00',
  },
  {
    post_id: 10,
    board_id: 1,
    UID: 2055,
    nickname: '스타일가이',
    subject: 'Flexbox와 Grid, 더 이상 헷갈리지 마세요! (실전 예제 포함)',
    contents:
      '복잡한 레이아웃도 5줄 이내로 끝내는 핵심 속성들을 정리했습니다. 반응형 웹의 기초를 다져봅시다.',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-15T09:00:00',
  },
  {
    post_id: 9,
    board_id: 1,
    UID: 3012,
    nickname: '제이에스고수',
    subject: '자바스크립트 ES14 신기능 미리보기: 더 간결해진 문법들',
    contents:
      '배열 메서드부터 비동기 처리까지, 새롭게 추가된 자바스크립트 최신 문법들을 실전 코드로 익혀봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-14T20:00:00',
  },
  {
    post_id: 8,
    board_id: 1,
    UID: 1088,
    nickname: '리액트러버',
    subject: 'React Server Components 도입 전 꼭 알아야 할 것들',
    contents:
      '리액트의 패러다임이 변하고 있습니다. 서버 컴포넌트의 개념과 효율적인 상태 관리 전략을 다룹니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-14T10:00:00',
  },
  {
    post_id: 7,
    board_id: 1,
    UID: 4001,
    nickname: '팀리더K',
    subject: 'Git을 활용한 효율적인 코드 리뷰 프로세스 만들기',
    contents:
      '팀원들과 함께 성장하는 코드 리뷰 문화! Pull Request 템플릿과 브랜치 관리 노하우를 공유합니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-13T14:00:00',
  },
  {
    post_id: 6,
    board_id: 1,
    UID: 5022,
    nickname: '넥스트마스터',
    subject: 'Next.js 15 버전 업데이트 핵심 내용 정리',
    contents:
      '성능 최적화와 새로운 라우팅 시스템 등, 이번 업데이트에서 가장 중요한 변화 5가지를 뽑아봤습니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-12T09:30:00',
  },
  {
    post_id: 5,
    board_id: 1,
    UID: 1011,
    nickname: '알고팡',
    subject: '입문자를 위한 자바스크립트 알고리즘 기초 문제 10선',
    contents:
      '코딩 테스트의 시작! 가장 기본이 되는 10가지 알고리즘 문제를 자바스크립트로 풀어봅시다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-11T16:20:00',
  },
  {
    post_id: 4,
    board_id: 1,
    UID: 2033,
    nickname: '타입스크립터',
    subject: 'TypeScript 제네릭(Generic) 완벽 가이드',
    contents:
      'any 타입은 이제 그만! 제네릭을 활용하여 재사용성 높고 안전한 함수를 만드는 방법을 알아봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-10T11:00:00',
  },
  {
    post_id: 3,
    board_id: 1,
    UID: 4055,
    nickname: '뷰장인',
    subject: 'Vue 3 Composition API 실전 활용법',
    contents:
      'Options API와 비교하여 Composition API가 가지는 장점과 실무 적용 사례를 살펴봅니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-09T14:45:00',
  },
  {
    post_id: 2,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '웹 접근성(A11y) 향상을 위한 ARIA 속성 가이드',
    contents:
      '스크린 리더 사용자를 배려하는 착한 웹사이트 만들기. 꼭 알아야 할 WAI-ARIA 속성들을 정리했습니다.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-08T10:10:00',
  },
  {
    post_id: 1,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '자습방 게시판 오픈을 환영합니다!',
    contents:
      '앞으로 유익한 개발 정보와 꿀팁들을 많이 공유해 주세요. 모두 파이팅입니다!',
    type: '기타', // '전체'에서 '기타'로 변경
    typeIndex: 5,
    create_date: '2026-02-01T09:00:00',
  },
  {
    post_id: 12,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '2026년 웹 개발 트렌드 총정리: 우리가 준비해야 할 것들',
    contents:
      '프론트엔드부터 백엔드까지, 올해 가장 주목받는 기술 스택과 변화하는 개발 문화를 살펴봅니다.',
    type: 'JavaScript', // '전체'에서 'JavaScript'로 변경
    typeIndex: 3,
    create_date: '2026-02-15T15:45:00',
  },
  {
    post_id: 11,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '시맨틱 마크업의 정석: 검색 엔진이 좋아하는 구조 짜기',
    contents:
      'div만 쓰는 코딩은 이제 그만! 시맨틱 태그를 적재적소에 활용하여 접근성과 SEO를 동시에 잡아보세요.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-15T12:30:00',
  },
  {
    post_id: 10,
    board_id: 1,
    UID: 2055,
    nickname: '스타일가이',
    subject: 'Flexbox와 Grid, 더 이상 헷갈리지 마세요! (실전 예제 포함)',
    contents:
      '복잡한 레이아웃도 5줄 이내로 끝내는 핵심 속성들을 정리했습니다. 반응형 웹의 기초를 다져봅시다.',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-15T09:00:00',
  },
  {
    post_id: 9,
    board_id: 1,
    UID: 3012,
    nickname: '제이에스고수',
    subject: '자바스크립트 ES14 신기능 미리보기: 더 간결해진 문법들',
    contents:
      '배열 메서드부터 비동기 처리까지, 새롭게 추가된 자바스크립트 최신 문법들을 실전 코드로 익혀봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-14T20:00:00',
  },
  {
    post_id: 8,
    board_id: 1,
    UID: 1088,
    nickname: '리액트러버',
    subject: 'React Server Components 도입 전 꼭 알아야 할 것들',
    contents:
      '리액트의 패러다임이 변하고 있습니다. 서버 컴포넌트의 개념과 효율적인 상태 관리 전략을 다룹니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-14T10:00:00',
  },
  {
    post_id: 7,
    board_id: 1,
    UID: 4001,
    nickname: '팀리더K',
    subject: 'Git을 활용한 효율적인 코드 리뷰 프로세스 만들기',
    contents:
      '팀원들과 함께 성장하는 코드 리뷰 문화! Pull Request 템플릿과 브랜치 관리 노하우를 공유합니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-13T14:00:00',
  },
  {
    post_id: 6,
    board_id: 1,
    UID: 5022,
    nickname: '넥스트마스터',
    subject: 'Next.js 15 버전 업데이트 핵심 내용 정리',
    contents:
      '성능 최적화와 새로운 라우팅 시스템 등, 이번 업데이트에서 가장 중요한 변화 5가지를 뽑아봤습니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-12T09:30:00',
  },
  {
    post_id: 5,
    board_id: 1,
    UID: 1011,
    nickname: '알고팡',
    subject: '입문자를 위한 자바스크립트 알고리즘 기초 문제 10선',
    contents:
      '코딩 테스트의 시작! 가장 기본이 되는 10가지 알고리즘 문제를 자바스크립트로 풀어봅시다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-11T16:20:00',
  },
  {
    post_id: 4,
    board_id: 1,
    UID: 2033,
    nickname: '타입스크립터',
    subject: 'TypeScript 제네릭(Generic) 완벽 가이드',
    contents:
      'any 타입은 이제 그만! 제네릭을 활용하여 재사용성 높고 안전한 함수를 만드는 방법을 알아봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-10T11:00:00',
  },
  {
    post_id: 3,
    board_id: 1,
    UID: 4055,
    nickname: '뷰장인',
    subject: 'Vue 3 Composition API 실전 활용법',
    contents:
      'Options API와 비교하여 Composition API가 가지는 장점과 실무 적용 사례를 살펴봅니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-09T14:45:00',
  },
  {
    post_id: 2,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '웹 접근성(A11y) 향상을 위한 ARIA 속성 가이드',
    contents:
      '스크린 리더 사용자를 배려하는 착한 웹사이트 만들기. 꼭 알아야 할 WAI-ARIA 속성들을 정리했습니다.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-08T10:10:00',
  },
  {
    post_id: 1,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '자습방 게시판 오픈을 환영합니다!',
    contents:
      '앞으로 유익한 개발 정보와 꿀팁들을 많이 공유해 주세요. 모두 파이팅입니다!',
    type: '기타', // '전체'에서 '기타'로 변경
    typeIndex: 5,
    create_date: '2026-02-01T09:00:00',
  },
  {
    post_id: 12,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '2026년 웹 개발 트렌드 총정리: 우리가 준비해야 할 것들',
    contents:
      '프론트엔드부터 백엔드까지, 올해 가장 주목받는 기술 스택과 변화하는 개발 문화를 살펴봅니다.',
    type: 'JavaScript', // '전체'에서 'JavaScript'로 변경
    typeIndex: 3,
    create_date: '2026-02-15T15:45:00',
  },
  {
    post_id: 11,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '시맨틱 마크업의 정석: 검색 엔진이 좋아하는 구조 짜기',
    contents:
      'div만 쓰는 코딩은 이제 그만! 시맨틱 태그를 적재적소에 활용하여 접근성과 SEO를 동시에 잡아보세요.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-15T12:30:00',
  },
  {
    post_id: 10,
    board_id: 1,
    UID: 2055,
    nickname: '스타일가이',
    subject: 'Flexbox와 Grid, 더 이상 헷갈리지 마세요! (실전 예제 포함)',
    contents:
      '복잡한 레이아웃도 5줄 이내로 끝내는 핵심 속성들을 정리했습니다. 반응형 웹의 기초를 다져봅시다.',
    type: 'CSS',
    typeIndex: 2,
    create_date: '2026-02-15T09:00:00',
  },
  {
    post_id: 9,
    board_id: 1,
    UID: 3012,
    nickname: '제이에스고수',
    subject: '자바스크립트 ES14 신기능 미리보기: 더 간결해진 문법들',
    contents:
      '배열 메서드부터 비동기 처리까지, 새롭게 추가된 자바스크립트 최신 문법들을 실전 코드로 익혀봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-14T20:00:00',
  },
  {
    post_id: 8,
    board_id: 1,
    UID: 1088,
    nickname: '리액트러버',
    subject: 'React Server Components 도입 전 꼭 알아야 할 것들',
    contents:
      '리액트의 패러다임이 변하고 있습니다. 서버 컴포넌트의 개념과 효율적인 상태 관리 전략을 다룹니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-14T10:00:00',
  },
  {
    post_id: 7,
    board_id: 1,
    UID: 4001,
    nickname: '팀리더K',
    subject: 'Git을 활용한 효율적인 코드 리뷰 프로세스 만들기',
    contents:
      '팀원들과 함께 성장하는 코드 리뷰 문화! Pull Request 템플릿과 브랜치 관리 노하우를 공유합니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-13T14:00:00',
  },
  {
    post_id: 6,
    board_id: 1,
    UID: 5022,
    nickname: '넥스트마스터',
    subject: 'Next.js 15 버전 업데이트 핵심 내용 정리',
    contents:
      '성능 최적화와 새로운 라우팅 시스템 등, 이번 업데이트에서 가장 중요한 변화 5가지를 뽑아봤습니다.',
    type: 'React',
    typeIndex: 4,
    create_date: '2026-02-12T09:30:00',
  },
  {
    post_id: 5,
    board_id: 1,
    UID: 1011,
    nickname: '알고팡',
    subject: '입문자를 위한 자바스크립트 알고리즘 기초 문제 10선',
    contents:
      '코딩 테스트의 시작! 가장 기본이 되는 10가지 알고리즘 문제를 자바스크립트로 풀어봅시다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-11T16:20:00',
  },
  {
    post_id: 4,
    board_id: 1,
    UID: 2033,
    nickname: '타입스크립터',
    subject: 'TypeScript 제네릭(Generic) 완벽 가이드',
    contents:
      'any 타입은 이제 그만! 제네릭을 활용하여 재사용성 높고 안전한 함수를 만드는 방법을 알아봅니다.',
    type: 'JavaScript',
    typeIndex: 3,
    create_date: '2026-02-10T11:00:00',
  },
  {
    post_id: 3,
    board_id: 1,
    UID: 4055,
    nickname: '뷰장인',
    subject: 'Vue 3 Composition API 실전 활용법',
    contents:
      'Options API와 비교하여 Composition API가 가지는 장점과 실무 적용 사례를 살펴봅니다.',
    type: '기타',
    typeIndex: 5,
    create_date: '2026-02-09T14:45:00',
  },
  {
    post_id: 2,
    board_id: 1,
    UID: 1024,
    nickname: '마크업장인',
    subject: '웹 접근성(A11y) 향상을 위한 ARIA 속성 가이드',
    contents:
      '스크린 리더 사용자를 배려하는 착한 웹사이트 만들기. 꼭 알아야 할 WAI-ARIA 속성들을 정리했습니다.',
    type: 'HTML',
    typeIndex: 1,
    create_date: '2026-02-08T10:10:00',
  },
  {
    post_id: 1,
    board_id: 1,
    UID: 1001,
    nickname: '트렌드세터',
    subject: '자습방 게시판 오픈을 환영합니다!',
    contents:
      '앞으로 유익한 개발 정보와 꿀팁들을 많이 공유해 주세요. 모두 파이팅입니다!',
    type: '기타', // '전체'에서 '기타'로 변경
    typeIndex: 5,
    create_date: '2026-02-01T09:00:00',
  },
]

let currentPage = 1
let currentDisplayData = postData
const itemsPerPage = 8
const pageCount = 5

const postListElement = document.querySelector('.main-post__list')
const paginationList = document.querySelector('.pagination__list')
const firstButton = document.querySelector('.pagination__control--first')
const prevButton = document.querySelector('.pagination__control--prev')
const nextButton = document.querySelector('.pagination__control--next')
const nextGroupButton = document.querySelector(
  '.pagination__control--next-group',
)
const categoryButton = document.querySelectorAll('.main-category__button')
const searchInput = document.getElementById('main-search__item')
console.log(searchInput)

function timeForToday(value) {
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

function renderPosts(page, data) {
  if (data.length === 0) {
    postListElement.innerHTML = `
      <div class="main-post__no-result">
        <p>검색 결과가 없습니다.</p>
      </div>
    `
    return // 👈 데이터가 없으니 아래 로직은 실행하지 말고 여기서 끝내라는 뜻!
  }
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const sliceData = data.slice(startIndex, endIndex)

  postListElement.innerHTML = sliceData
    .map(
      // 리스트 클릭 -> 해당 글 읽기 페이지 연동 위해 data-id="${post.post_id}" (포스트 고유값) 추가
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
}

function setupPaginationEvents(data) {
  const pageButtons = document.querySelectorAll('.pagination__link')
  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.textContent)
      updateUI(data)
    })
  })
}

function renderPagination(data) {
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

function updateUI(data) {
  currentDisplayData = data
  renderPosts(currentPage, data)
  renderPagination(data)
}

nextButton.addEventListener('click', () => {
  const currentTotalPage = Math.ceil(currentDisplayData.length / itemsPerPage)
  if (currentPage < currentTotalPage) {
    currentPage++
    updateUI(currentDisplayData)
  }
})

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    updateUI(currentDisplayData)
  }
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

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase().trim()
  const postValue = postData.filter(({ subject }) =>
    subject.toLowerCase().includes(searchValue),
  )
  currentPage = 1
  updateUI(postValue)
})

categoryButton.forEach((category) => {
  category.addEventListener('click', () => {
    const targetIndex = Number(category.dataset.index)
    categoryButton.forEach((btn) => btn.classList.remove('is-active'))
    category.classList.add('is-active')

    const filterData =
      targetIndex === 0
        ? postData
        : postData.filter(({ typeIndex }) => typeIndex === targetIndex)

    currentPage = 1
    updateUI(filterData)
  })
})

// updateUI(postData)
// 기존 더미데이터를 실제 작성한 글이 보이도록 교체

// 서버에서 글 목록 가져오기 (fetch)
// 자습방 글만 보이게 (filter)
// 화면이 이해하는 형태로 변환 (map)
// 화면에 뿌리기 (uadateUI(postData))
async function init() {
  try {
    // const response = await fetch('http://localhost:4000/posts')
    // if (!response.ok) throw new Error('데이터 불러오기 실패')
    // 로컬스토리지 -> 자체 api
    const response = await fetch(
      'https://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=1&page=1',
    )
    if (!response.ok) throw new Error('데이터 불러오기 실패')

    const result = await response.json()
    // 최신순 정렬
    const serverPosts = result.data.sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date),
    )

    // 자습방 글만 필터
    const studyPosts = serverPosts.filter((item) => Number(item.board_id) === 1)

    const typeMap = {
      HTML: 1,
      CSS: 2,
      Javascript: 3,
      React: 4,
      기타: 5,
    }

    postData = studyPosts.map((post) => ({
      post_id: Number(post.post_id),
      board_id: Number(post.board_id), // 게시판 임시값
      UID: Number(post.user_id), // 유저 아이디 임시값
      nickname: post.user_nickname || '사용자',
      subject: post.subject,
      contents: post.contents,
      type: post.type,
      typeIndex: typeMap[post.type] ?? 0,
      create_date: post.create_date,
    }))

    updateUI(postData)
  } catch (error) {
    console.error(error)
    updateUI(postData)
  }
}

init()

// 클릭하면 글 읽기 페이지로 이동 (data-id="${post.post_id}")

postListElement.addEventListener('click', (e) => {
  // 템플릿 리터럴에 쓰인 a href = # 로 페이지 이동X -> preventDefault() 추가
  e.preventDefault()

  const item = e.target.closest('.main-post__item')
  if (!item) return

  const postId = item.dataset.id
  localStorage.setItem('selectedPostId', postId)
  localStorage.setItem('selectedBoardId', 1)

  // 읽기 페이지 이동
  location.href = '../readpost/index.html'
})
