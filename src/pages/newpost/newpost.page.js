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
// const BASE_URL = 'http://leedh9276.dothome.co.kr/likelion-vanilla'

// 글쓰기, 수정하기 페이지 진입시 회원 검증
document.addEventListener('DOMContentLoaded', async () => {
  const user = await checkToken()
  // 유저가 아니라면 되돌리기
  if (!user) {
    alert('로그인이 필요합니다.')
    window.location.href = '/src/pages/users/login/index.html'
    return // 이제 함수 안이므로 정상 작동합니다
  }
  // 로그인했을 때만 실행될 나머지 코드들...
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

  // 마크다운 줄바꿈 허용
  marked.setOptions({ breaks: true })

  // 미리보기
  function renderPreview() {
    const markdownTitle = title.value.trim()
    const markdownContent = textarea.value.trim()

    if (!markdownTitle && !markdownContent) {
      previewContent.innerHTML = `<h2>제목 미리보기</h2>
      <p>내용 미리보기</p>`
      return
    }
    // 마크다운 XSS방지 sanitizing
    const rawHtml = `<h2>${markdownTitle}</h2>` + marked.parse(markdownContent)
    const sanitizedHtml = DOMPurify.sanitize(rawHtml)

    previewContent.innerHTML = sanitizedHtml
  }

  title.addEventListener('input', renderPreview)
  textarea.addEventListener('input', renderPreview)
  renderPreview()

  // 수정 모드일 경우, 수정하려는 글 데이터 가져오기
  if (editPostId) {
    try {
      //read.php에 postId고유값을 보내서 해당 글 데이터를 JSON 형태로 GET(-> 기본값) 메서드로 받아오기
      const response = await fetch(
        `${BASE_URL}/board/read.php?post_id=${editPostId}`,
      )

      if (!response.ok) throw new Error('게시글 불러오기 실패')
      //json
      const post = await response.json()

      // 타이틀, 페이지 헤드, 버튼 문구 변경
      document.title = '글 수정 - 아기사자 공부방'
      if (pageTitle) pageTitle.textContent = '게시글 수정'
      if (primaryBtn) primaryBtn.textContent = '수정 완료'
      if (titleDesc)
        titleDesc.textContent =
          '내가 쓴 글을 수정합니다. (※게시판 이동은 불가합니다.)'

      // 값 세팅
      title.value = post.subject
      textarea.value = post.contents
      categorySelect.value = post.type

      // 게시판 세팅
      const boardValue = Number(post.board_id) === 2 ? 'qna' : 'study'
      const radio = document.querySelector(
        `input[name="boardType"][value="${boardValue}"]`,
      )
      // 라디오버튼 값이 존재하면 체크
      if (radio) {
        radio.checked = true
      }

      // 수정 모드에서는 게시판 변경 불가 (자습방에 댓글 노출 안함)
      const boardRadios = document.querySelectorAll('input[name="boardType"]')
      // 라디오 버튼이 두개니까 forEach로 하나씩 꺼내와서 disabled 시켜줘야 함.
      boardRadios.forEach((r) => {
        r.disabled = true
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

  //==========================================================================================

  // 작성완료 버튼 -> 게시물 목록으로 이동

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const accessToken = localStorage.getItem('access_token')

    // 에러날 경우 대비 하여 await 보다 상위에서 보호
    try {
      // 수정할 경우
      if (editPostId) {
        // payload(body)가 값을 가짐 (!= null)
        const updatePayload = {
          board_id: formData.get('boardType') === 'qna' ? 2 : 1,
          user_uid: user.UID,
          user_id: user.user_id,
          subject: formData.get('title'),
          contents: formData.get('content'),
          type: formData.get('categorySelect'),
          post_id: editPostId,
        }
        // 서버의 update.php 를 페치한다 (PATCH 메소드, JSON 방식으로)
        const response = await fetch(`${BASE_URL}/board/update.php`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatePayload),
        })
        // 만약 네트워크 실패(->catch)가 아닌 400-500과 같은 오류일 경우,
        if (!response.ok) throw new Error('수정 실패')

        //==========================================================================================

        // 글 작성 (editPostId 가 없는 경우,)
      } else {
        // 생성된 데이터를 담을 formData를 만듦
        // key : value(서버의 칼럼명)
        const writeData = new FormData()
        writeData.append(
          'board_id',
          formData.get('boardType') === 'qna' ? 2 : 1,
        )
        writeData.append('user_id', user.UID)
        writeData.append('subject', formData.get('title'))
        writeData.append('contents', formData.get('content'))
        writeData.append('type', formData.get('categorySelect'))
        // 서버의 write.php에 POST 메서드로 새롭게 만든 폼을 보내기 위해 writeData를 만듦
        const response = await fetch(`${BASE_URL}/board/write.php`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          // formData의 이름 (JSON으로 보낼 땐 문자열화 해서 보내고 formData로 보낼땐 변수로 만들어 보냄)
          body: writeData,
        })
        // catch가 아닌 400-500 에러일 경우 (네트워크가 실패한 경우: fetch > catch, 400 - 500 은 네트워크 실패가 X)
        if (!response.ok) throw new Error('작성 실패')
      }

      // 작성 완료 후 선택한 게시판 리스트로 이동
      alert('글이 저장되었습니다')
      // 작성 후 이동할 게시판 리스트 경로 설정 (폼데이터에 선택되어 들어간 게시판)
      const board = formData.get('boardType')
      location.href =
        board === 'qna' ? '../qna/index.html' : '../studyroom/index.html'

      // 네트워크 실패시 에러 알럿
    } catch (error) {
      console.error(error)
      alert('에러 발생')
    }
  })
})
