import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // 멀티 페이지 빌드 설정
    rollupOptions: {
      input: {
        main: resolve('index.html'), // 메인 홈
        dashboard: resolve('src/pages/dashboard/index.html'), // 대시보드 페이지
        login: resolve('src/pages/users/login/index.html'), // 로그인 페이지
        mypage: resolve('src/pages/users/mypage/index.html'), // 마이페이지
        qna: resolve('src/pages/qna/index.html'), // Q&A 페이지
        signup: resolve('src/pages/users/sign_up/index.html'), // 회원가입 페이지
        studyroom: resolve('src/pages/studyroom/index.html'), // 스터디룸
      },
    },
  },
})
