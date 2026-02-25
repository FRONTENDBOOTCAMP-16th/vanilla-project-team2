// 마크다운 라이브러리
// sanitize 라이브러리

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'
import { checkToken } from '../../api/JWT.js'

// 유저가 아니라면 되돌리기
function userInit() {
  const user = await checkToken(); // 유저 확인 로직

  if (!user) {
    alert('로그인이 필요합니다.');
    window.location.href = '/src/pages/users/login/index.html';
    return; // 이제 함수 안이므로 정상 작동합니다.
  }

  // 로그인했을 때만 실행될 나머지 코드들...
  console.log('로그인 성공, 페이지 로드를 시작합니다.');
}

userInit();

// 수정 (값이 있으면 수정, null이면 새글 작성)
const params = new URLSearchParams(location.search)
const editPostId = params.get('postId')
// let originalPost = null



// 새 글쓰기
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.newpost__form')
  const title = document.getElementById('title')
  const textarea = document.getElementById('content')
  const previewContent = document.getElementById('previewContent')

  marked.setOptions({ breaks: true })

  //미리보기
  function renderPreview() {
    const markdownTitle = title.value.trim()
    const markdownContent = textarea.value.trim()

    if (!markdownTitle && !markdownContent) {
      previewContent.innerHTML = `<h2>제목 미리보기</h2>
      <p>내용 미리보기</p>`
      return
    }

    const rawHtml = `<h2>${markdownTitle}</h2>` + marked.parse(markdownContent)
    const sanitizedHtml = DOMPurify.sanitize(rawHtml)

    previewContent.innerHTML = sanitizedHtml
  }

  title.addEventListener('input', renderPreview)
  textarea.addEventListener('input', renderPreview)
  renderPreview()

  if (editPostId) {
    if (editPostId) {
      const pageTitle = document.querySelector('.newpost__title')
      const primaryBtn = document.querySelector('.button__text')

      if (pageTitle) pageTitle.textContent = '게시글 수정'
      if (primaryBtn) primaryBtn.textContent = '수정 완료'
    }

    try {
      const response = await fetch(
        `http://leedh9276.dothome.co.kr/likelion-vanilla/board/read.php?post_id=${editPostId}`,
      )
      if (!response.ok) throw new Error('게시글 불러오기 실패')

      const post = await response.json()

      // console.log('불러온 게시글:', post)

      // 값 세팅
      title.value = post.subject
      textarea.value = post.contents

      // 카테고리 세팅
      document.querySelector('[name="categorySelect"]').value = post.type

      // 게시판 세팅
      const boardValue = Number(post.board_id) === 2 ? 'qna' : 'study'
      const selector = `input[name="boardType"][value="${boardValue}"]`
      const radio = document.querySelector(selector)

      if (radio) {
        radio.checked = true
      }

      // 수정 모드에서는 게시판 변경 불가 (자습방에 댓글 노출 안함)
      const boardRadios = document.querySelectorAll('input[name="boardType"]')

      boardRadios.forEach((r) => {
        r.style.cursor = 'not-allowed'
        r.parentElement.style.opacity = '0.6'
        r.tabIndex = -1

        // 값 변경 방지
        r.addEventListener('change', () => {
          boardRadios.forEach((radio) => {
            radio.checked = radio.value === boardValue
          })
        })
      })

      // 미리보기 다시 렌더
      renderPreview()
    } catch (error) {
      console.error(error)
      alert('게시글을 불러오지 못했습니다')
    }
  }

  // 작성(수정) 취소
  document.querySelector('.button--ghost').addEventListener('click', () => {
    history.back()
  })

  // 작성완료 > 게시물 목록으로 이동

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log('글 작성 폼 제출됨')
    const formData = new FormData(form)

    try {
      let response

      const userInfo = await checkToken()

      if (!userInfo) {
        alert('로그인이 필요합니다.')
        window.location.href = '/src/pages/users/login/index.html';
        return
      }
      const accessToken = localStorage.getItem('access_token')

console.log('현재 로그인 유저:', userInfo)
console.log('토큰:', accessToken)

if (editPostId) {
  const catagories = formData.get('categorySelect')
  // const catagoriesPayload = JSON.stringify(catagories)

  const updatePayload = {
    board_id: formData.get('boardType') === 'qna' ? 2 : 1,
    user_uid: userInfo.UID,
    user_id: userInfo.user_id,
    subject: formData.get('title'),
    contents: formData.get('content'),
    type: catagories,
    post_id: editPostId,
  }

  response = await fetch(
    'http://leedh9276.dothome.co.kr/likelion-vanilla/board/update.php',
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatePayload),
    },
  )
  console.log(localStorage.getItem('access_token'))

  // headers: { 'Content-Type': 'application/json' },
  // body: JSON.stringify(data),
  if (!response.ok) throw new Error('수정 실패')

  const result = await response.text()
  console.log('수정 응답:', result)

  if (!result.includes('success') && result !== '1') {
    throw new Error('DB 업데이트 실패')
  }
} else {
  const catagories = formData.get('categorySelect')
  // const catagoriesPayload = JSON.stringify(catagories)

  const writeData = new FormData()
  writeData.append('board_id', formData.get('boardType') === 'qna' ? 2 : 1)
  writeData.append('user_id', userInfo.UID)
  writeData.append('subject', formData.get('title'))
  writeData.append('contents', formData.get('content'))
  writeData.append('type', catagories)

  response = await fetch(
    'http://leedh9276.dothome.co.kr/likelion-vanilla/board/write.php',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: writeData,
    },
  )
  if (!response.ok) throw new Error('수정 실패')

  const result = await response.text()
  console.log('서버 응답:', result)
}

      alert('글이 저장되었습니다')

      // 작성 완료 후 선택한 게시판 리스트로 이동
      // src 폴더는 배포 후 사라지므로  상대경로를 이용하여 이동시킴 (location.href = `/src/pages/${board}/index.html` ❌)
      const board = formData.get('boardType')

      location.href =
        board === 'qna' ? '../qna/index.html' : '../studyroom/index.html'

      // form.reset()
    } catch (error) {
      console.error(error)
      alert('에러 발생')
    }
  })
})
