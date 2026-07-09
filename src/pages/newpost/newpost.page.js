/* ================================
   Import
================================= */
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'
import { checkToken } from '../../api/JWT.js'
import { BASE_URL } from '../../api/api.js'

/* ================================
   State
================================= */
const params = new URLSearchParams(location.search)
const editPostId = params.get('postId')
// const BASE_URL = 'https://leedh9276.dothome.co.kr/likelion-vanilla'

// 글 작성과 수정은 사용자 식별자가 필요하므로 화면 초기화 전에 토큰을 먼저 검증한다.
document.addEventListener('DOMContentLoaded', async () => {
  const user = await checkToken()
  if (!user) {
    alert('로그인이 필요합니다.')
    window.location.href = (window.ROOT_PATH || './') + 'src/pages/users/login/index.html'
    return
  }
  console.log('로그인 성공')

  /* ================================
   DOM caching
================================= */
  const form = document.querySelector('.newpost__form')
  const title = document.getElementById('title')
  const pageTitle = document.querySelector('.newpost__title')
  const primaryBtn = document.querySelector('.button__text')
  const titleDesc = document.querySelector('.newpost__desc')
  const textarea = document.getElementById('content')
  const previewContent = document.getElementById('previewContent')
  const categorySelect = document.querySelector('[name="categorySelect"]')

  // 줄바꿈을 문단 안에서도 유지해 작성 중 미리보기가 실제 게시글과 비슷하게 보이도록 한다.
  marked.setOptions({ breaks: true })

  // 입력값을 Markdown으로 변환한 뒤 DOMPurify로 정제해 미리보기 영역에 반영한다.
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

  // postId 쿼리가 있으면 기존 게시글을 읽어 폼을 수정 모드로 초기화한다.
  if (editPostId) {
    try {
      const response = await fetch(
        `${BASE_URL}/board/read.php?post_id=${editPostId}`,
      )

      if (!response.ok) throw new Error('게시글 불러오기 실패')
      const post = await response.json()

      // 수정 모드에서는 사용자가 같은 화면을 다른 목적의 폼으로 인식할 수 있게 문구를 바꾼다.
      document.title = '글 수정 - 아기사자 공부방'
      if (pageTitle) pageTitle.textContent = '게시글 수정'
      if (primaryBtn) primaryBtn.textContent = '수정 완료'
      if (titleDesc)
        titleDesc.textContent =
          '내가 쓴 글을 수정합니다. 게시판은 변경할 수 없습니다.'

      title.value = post.subject
      textarea.value = post.contents
      categorySelect.value = post.type

      const boardValue = Number(post.board_id) === 2 ? 'qna' : 'study'
      const radio = document.querySelector(
        `input[name="boardType"][value="${boardValue}"]`,
      )
      if (radio) {
        radio.checked = true
      }

      // 게시글 이동은 댓글 정책과 목록 필터에 영향을 주므로 수정 화면에서는 게시판을 고정한다.
      const boardRadios = document.querySelectorAll('input[name="boardType"]')
      boardRadios.forEach((r) => {
        r.disabled = true
      })

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

  //==========================================================================================

  // 작성완료 버튼 -> 게시물 목록으로 이동

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const accessToken = localStorage.getItem('access_token')

    // 네트워크 오류와 서버 오류를 한 곳에서 처리하기 위해 저장 흐름 전체를 try/catch로 감싼다.
    try {
      if (editPostId) {
        // 수정 API는 JSON PATCH를 사용하므로 FormData 값을 명시적인 payload로 변환한다.
        const updatePayload = {
          board_id: formData.get('boardType') === 'qna' ? 2 : 1,
          user_uid: user.UID,
          user_id: user.user_id,
          subject: formData.get('title'),
          contents: formData.get('content'),
          type: formData.get('categorySelect'),
          post_id: editPostId,
        }
        const response = await fetch(`${BASE_URL}/board/update.php`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatePayload),
        })
        if (!response.ok) throw new Error('수정 실패')

      } else {
        // 작성 API는 PHP의 $_POST로 값을 읽기 때문에 FormData로 서버 컬럼명에 맞춰 전송한다.
        const writeData = new FormData()
        writeData.append(
          'board_id',
          formData.get('boardType') === 'qna' ? 2 : 1,
        )
        writeData.append('user_id', user.UID)
        writeData.append('subject', formData.get('title'))
        writeData.append('contents', formData.get('content'))
        writeData.append('type', formData.get('categorySelect'))
        const response = await fetch(`${BASE_URL}/board/write.php`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: writeData,
        })
        if (!response.ok) throw new Error('작성 실패')
      }

      alert('글이 저장되었습니다')
      const board = formData.get('boardType')
      location.href =
        board === 'qna' ? '../qna/index.html' : '../studyroom/index.html'

    } catch (error) {
      console.error(error)
      alert('에러 발생')
    }
  })
})
