import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

// ESM 환경에서 __dirname 정의하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 특정 디렉토리 내의 index.html 파일들을 찾는 함수
 * 호출하기 전에 반드시 선언되어 있어야 합니다.
 */
function getHtmlEntries(baseDir) {
  const entries = {};
  const absoluteBaseDir = resolve(__dirname, baseDir);
  
  if (!fs.existsSync(absoluteBaseDir)) return entries;

  const folders = fs.readdirSync(absoluteBaseDir);
  
  folders.forEach((folder) => {
    const fullPath = resolve(absoluteBaseDir, folder, 'index.html');
    if (fs.existsSync(fullPath)) {
      // 키 이름 예: login, mypage, sign_up
      entries[folder] = fullPath;
    }
  });
  
  return entries;
}

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        // 1. 직접 지정할 페이지들
        main: resolve(__dirname, 'index.html'),
        qna: resolve(__dirname, 'src/pages/qna/index.html'),
        studyroom: resolve(__dirname, 'src/pages/studyroom/index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard/index.html'),
        newpost: resolve(__dirname, 'src/pages/newpost/index.html'),
        readpost: resolve(__dirname, 'src/pages/readpost/index.html'),
        fallback: resolve(__dirname, 'src/pages/404/index.html'),

        // 2. src/pages/users 폴더 내의 파일들 자동 추가
        ...getHtmlEntries('src/pages/users'),
      },
    },
  },
});