# 🦁lion-study-room

조장 : 김한결  
조원 : 김효경, 사민재, 이동헌

## 🏷️주제

서로에게 동기부여가 되기 위한 공부방

## 🧰 개발 환경 (Development Environment)

| 구분                 | 내용                  |
| -------------------- | --------------------- |
| OS                   | Windows 11            |
| Editor               | Visual Studio Code    |
| Runtime / Build Tool | Vite (or Live Server) |
| Package Manager      | npm / bun             |
| Version Control      | Git / GitHub          |

## 🧩 기술 스택 (Tech Stack)

| 영역     | 기술                       |
| -------- | -------------------------- |
| Frontend | HTML5, CSS3, JavaScript    |
| Backend  | PHP                        |
| Database | MySQL                      |
| Tools    | Vite, Git/GitHub, Prettier |
| OS       | Windows                    |

## 🧩 기술 스택 (Tech Stack)

| 영역     | 기술                       |
| -------- | -------------------------- |
| Frontend | HTML5, CSS3, JavaScript    |
| Backend  | PHP                        |
| Database | MySQL                      |
| Tools    | Vite, Git/GitHub, Prettier |
| OS       | Windows                    |

## 🗂️ 파일구조

```
.
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

# API

https://openweathermap.org/api
