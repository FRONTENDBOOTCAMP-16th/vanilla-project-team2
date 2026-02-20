// 마크다운 라이브러리
// sanitize 라이브러리

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'
// 수정 (값이 있으면 수정, null이면 새글 작성)
const params = new URLSearchParams(location.search)
const editPostId = params.get('postId')
let originalPost = null

// 새 글쓰기
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.newpost__form')
  const title = document.getElementById('title')
  const textarea = document.getElementById('content')
  const previewContent = document.getElementById('previewContent')

  marked.setOptions({ breaks: true })

  //선택 글 수정
  if (editPostId) {
    // document.querySelector('.newpost__title').textContent = '게시글 수정'
    // document.querySelector('.button--primary').innerHTML =
    //   '<img src="/src/assets/icons/icon-save.svg" alt="" />수정 완료'
    // document.title = '게시글 수정'

    // const res = await fetch(`http://localhost:4000/posts/${editPostId}`)
    // const post = await res.json()
    // originalPost = post

    // title.value = post.subject
    // textarea.value = post.contents
    // form.elements['categorySelect'].value = post.type
    // form.elements['boardType'].value = post.board_id === 2 ? 'qna' : 'study'
    console.log('수정 api 필요')
    alert('수정 기능 준비중')
    return
  }

  //미리보기
  function renderPreview() {
    const markdownTitle = title.value.trim()
    const markdownContent = textarea.value.trim()

    if (!markdownTitle && !markdownContent) {
      previewContent.innerHTML = `<h2>제목 미리보기</h2>
      <p>내용 미리보기</p>`
      return
    }

    // previewContent.innerHTML =
    //   `<h2>${markdownTitle}</h2>` + marked.parse(markdownContent)
    const rawHtml = `<h2>${markdownTitle}</h2>` + marked.parse(markdownContent)
    const sanitizedHtml = DOMPurify.sanitize(rawHtml)

    previewContent.innerHTML = sanitizedHtml
  }

  title.addEventListener('input', renderPreview)
  textarea.addEventListener('input', renderPreview)
  renderPreview()

  // 작성(수정) 취소
  document.querySelector('.button--ghost').addEventListener('click', () => {
    history.back()
  })

  // 작성완료 > 게시물 목록으로 이동

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log('글 작성 폼 제출됨')

    // 카테고리 문자열을 숫자로(typeIndex) 매핑하기 위한 변수
    // 데이터값은 소문자로 통일(select value같이)하는 것이 좋음 나중에 논의 필요
    // const categoryMap = {
    //   HTML: 1,
    //   CSS: 2,
    //   JavaScript: 3,
    //   React: 4,
    //   기타: 5,
    // }
    const formData = new FormData(form)

    // const data = editPostId
    // ? {
    //     ...originalPost,
    //     type: formData.get('categorySelect'),
    //     // 사용자가 고른 카테고리를 그에 따른 숫자 찾아 인덱싱
    //     typeIndex: categoryMap[formData.get('categorySelect')],
    //     user_id: 1, //임시
    //     board_id: formData.get('boardType') === 'qna' ? 2 : 1,
    //     subject: formData.get('title'),
    //     content: formData.get('content'),
    //   }
    // : {
    //     post_id: Date.now(), // 임시 ID
    //     board_id: formData.get('boardType') === 'qna' ? 2 : 1,
    //     UID: 0,
    //     nickname: '사용자', // 임시
    //     subject: formData.get('title'),
    //     contents: formData.get('content'),
    //     type: formData.get('categorySelect'),
    //     typeIndex: categoryMap[formData.get('categorySelect')],
    //     create_date: new Date().toISOString(),
    //   }

    try {
      let response

      if (editPostId) {
        // response = await fetch(`http://localhost:4000/posts/${editPostId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // })
        console.log('수정 api 필요')
        alert('수정 기능 준비중')
      } else {
        //새 글 작성
        const data = {
          board_id: formData.get('boardType') === 'qna' ? 2 : 1,
          user_id: 1,
          subject: formData.get('title'),
          content: formData.get('content'),
        }

        response = await fetch(
          'http://leedh9276.dothome.co.kr/likelion-vanilla/board/write.php',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          },
        )
      }

      if (!response.ok) throw new Error('저장 실패')

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
