/**
 * 404 Error Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  console.error('404 Not Found: 요청하신 페이지를 찾을 수 없습니다.');

  // 1. 이전 페이지로 돌아가기 버튼 기능 보강
  const backBtn = document.querySelector('.shortcut__btn--back');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      // 히스토리가 있는 경우에만 브라우저 뒤로가기 실행
      if (document.referrer && window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      }
    });
  }

  // 2. 링크 클릭 시 간단한 로그 (분석용 등으로 확장 가능)
  const suggestLinks = document.querySelectorAll('.suggest__link');
  suggestLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = e.currentTarget.querySelector('span')?.textContent;
      console.log(`사용자가 ${target} 페이지로 이동을 시도합니다.`);
    });
  });

  // 3. (선택사항) 특정 시간 후 자동으로 홈으로 리다이렉트 하고 싶다면 아래 주석을 해제하세요.
  /*
  setTimeout(() => {
    window.location.href = '/';
  }, 10000); // 10초 후 메인으로 이동
  */
});