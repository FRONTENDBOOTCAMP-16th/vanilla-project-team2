# 🦁Lion Study Room

조장 : 김한결  
조원 : 김효경, 사민재, 이동헌

## 🏷️주제

스터디 참여자들이 학습 현황을 확인하고,  
질문(QnA)과 게시글 작성을 통해 소통할 수 있는 바닐라 JavaScript 기반 학습 커뮤니티 웹 서비스입니다.

## 🔗 Demo

- 배포 주소 : http://leedh9207.dothome.co.kr/
  (http로 접속해야합니다)
- 개발 서버 : http://localhost:3000

## 🚀 실행 방법

git clone https://github.com/FRONTENDBOOTCAMP-16th/vanilla-project-team2.git  
cd vanilla-project-team2  
npm install  
npm run dev

## 🧰 개발 환경 (Development Environment)

| 구분                 | 내용               |
| -------------------- | ------------------ |
| Editor               | Visual Studio Code |
| Runtime / Build Tool | dothome            |
| Package Manager      | npm / bun          |
| Version Control      | Git / GitHub       |

## 🧩 기술 스택 (Tech Stack)

| 영역     | 기술                    |
| -------- | ----------------------- |
| Frontend | HTML5, CSS3, JavaScript |
| Backend  | PHP                     |
| Database | MySQL                   |
| Tools    | Git/GitHub, Prettier    |

## ⚙️ 주요 구현 내용

👤 회원 서비스

- 회원가입 시 입력값 검증 및 계정 생성 처리
- 로그인 시 사용자 인증 상태 저장(localStorage) 및 UI 반영
- 로그아웃 시 인증 정보 제거 및 메뉴 초기화
- 회원정보 조회 및 수정 기능 제공
- 회원 탈퇴 시 계정 정보 삭제 처리
- 로그인 상태에 따라 접근 가능한 페이지 제한 처리

📊 대시보드

- 공통 Header / Footer 레이아웃 적용으로 모든 페이지에서 동일한 UI 제공
- 외부 API(날씨, 명언)를 활용한 정보 카드 표시
- QnA 게시글 최신 목록 요약 제공
- 사용자 상태를 확인할 수 있는 메인 화면 구성

📚 자습방 (개인 학습자료실)

- 개인 학습자료 등록 / 수정 / 삭제 기능
- 카테고리(메뉴)별 자료 관리
- 작성한 자료 목록 조회

💬 QnA (공동 학습자료실)

- 질문 게시글 등록 / 수정 / 삭제 기능
- 전체 사용자 게시글 목록 조회
- 게시글 상세 조회 기능
- 페이지 이동 후에도 목록 상태 유지

## 📸 Screenshots

대시보드 자습방 QnA 글쓰기
(이미지 추가) (이미지 추가) (이미지 추가) (이미지 추가)

## 🗂️ 파일구조

```
├── public/                     # 정적 파일 (favicon, 공개 이미지 등)
├── src/
│   ├── assets/                 # 프로젝트 공용 이미지/아이콘
│   ├── components/             # ✅ HTML 공통 컴포넌트
│   │   └── component.html      # (예: navbar / footer / modal 등 공통 HTML)
│   ├── js/                     # 공통 JS 로직
│   │   ├── core/               # 상태/스토리지/API
│   │   ├── utils/              # 유틸 함수
│   │   ├── components/         # (선택) 컴포넌트 관련 JS
│   │   └── main.js             # 공통 초기화
│   ├── pages/                  # 페이지 단위 리소스
│   │   ├── dashboard/
│   │   │   └── index.html
│   │   ├── login/
│   │   │   └── index.html
│   │   ├── mypage/
│   │   │   └── index.html
│   │   ├── qna/
│   │   │   └── index.html
│   │   ├── signup/
│   │   │   ├── index.html
│   │   │   ├── signup.css
│   │   │   └── signup.page.js
│   │   └── studyroom/
│   │       ├── studyroom.html
│   │       ├── studyroom.css
│   │       └── studyroom.page.js
│   └── styles/                 # 전역 스타일
│       ├─ base.css             #reset, font, body 기본값
│       ├─ layout.css           #header/footer/nav/컨테이너
│       └── components.css      # 버튼, 카드, 배지, 모달
├── index.html
├── vite.config.mjs
├── package.json
└── README.md

```

## 🌐 API

- 날씨 API
  https://openweathermap.org/api
- 명언 API https://korean-advice-open-api.vercel.app/api/advice

## 🎈일정관리

- WBS
  https://docs.google.com/spreadsheets/d/1HwL7cM-AJQ6OmhCfo0MxOArtg63HtGmF2DU0CgpEd84/edit?gid=0#gid=0

## 🧩 Troubleshooting

1️⃣fetch로 불러온 HTML에서 이벤트가 동작하지 않던 문제

문제 : 동적으로 불러온 Header의 로그아웃 버튼 클릭 이벤트가 동작하지 않음  
원인 : 이벤트 리스너가 DOM 삽입 이전에 등록되어 실제 요소에 바인딩되지 않음  
해결 : 레이아웃 삽입 후 이벤트를 연결하도록 수정하고, 공통 이벤트 바인딩 함수를 별도로 구성

2️⃣  
3️⃣  
4️⃣

📚 배운 점

- 김한결 : 공통 레이아웃을 동적으로 로딩하는 구조를 구현하며 브라우저의 렌더링 과정과 DOM 생성 타이밍을 이해하였습니다.
  또한 fetch를 활용한 비동기 처리 과정에서 발생한 렌더링 순서 문제를 해결하며 프론트엔드 동작 흐름을 프로젝트를 통해서 구현하면서 학습할 수 있었습니다.

## 📄 라이선스

본 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.
