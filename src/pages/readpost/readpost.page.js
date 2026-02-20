// 마크다운 라이브러리
// sanitize 라이브러리

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'

// 키값(글의 고유 번호-postId) 꺼내 오기 위해 변수로 선언
const postId = localStorage.getItem('selectedPostId')
const boardId = localStorage.getItem('selectedBoardId')

const currentBoardId = localStorage.getItem('selectedBoardId') // 아까 저장한 1 또는 2
const commentSection = document.getElementById('comment-area')

if (currentBoardId === '1') {
  commentSection.style.display = 'none' // 또는 .classList.add('hidden')
} else {
  commentSection.style.display = 'block'
}

async function init() {
  const response = await fetch(
    `https://leedh9276.dothome.co.kr/likelion-vanilla/board/list_board.php?board_id=${boardId}&page=1`,
  )

  if (!response.ok) throw new Error('글 불러오기 실패')

  const result = await response.json()
  const post = result.data[0]

  // 지금 클릭한 글(post) id랑 같은 글 하나 찾아서(find) post에 넣어라
  // const post = posts.find((post) => String(post.post_id) === String(postId))
  // if (!post) {
  //   console.log('해당 글 없음')
  //   return
  // }

  if (!post) {
    console.log('글 없음')
    return
  }

  // 선택된 글 렌더링 (마크다운 문법-특정 css적용)
  const renderer = new marked.Renderer()

  renderer.code = function (code) {
    //   const text = typeof code === 'string' ? code : (code?.text ?? '')
    let text = ''

    if (typeof code === 'string') {
      text = code
    } else if (code && code.text) {
      text = code.text
    }

    return `
    <pre class="post__content--code">
    <code>${text}</code>
    </pre>
    `
  }

  marked.use({ renderer }) // 마크다운을 html로 바꿈(marked)-> marked야 {renderer}에 있는 설정을 사용(use) //use는 설정 객체(설정들을 모아둔 상자 - 객체)를 받는 함수라 중괄호 사용
  const rawHtml = marked.parse(post.contents)
  const sanitizedHtml = DOMPurify.sanitize(rawHtml) // 사용자가 쓴 script를 읽지 않게 하기 위해서 (XSS방지)

  document.querySelector('.post__category').textContent = post.type
  document.querySelector('.post__title').textContent = post.subject
  document.querySelector('.post__author-name').textContent = post.nickname
  document.querySelector('.post__content').innerHTML = sanitizedHtml
  loadComments(post.post_id)

  // 삭제

  const deleteBtn = document.querySelector('.post__btn--delete')

  deleteBtn.addEventListener('click', async () => {
    const ok = confirm('정말 글을 삭제하시겠습니까?')
    if (!ok) return

    await fetch(`http://localhost:4000/posts/${post.id}`, {
      method: 'DELETE',
    })

    if (Number(boardId) === 2) {
      location.href = '..qna/index.html'
    } else {
      location.href = '../studyroom/index.html'
    }
  })

  // 수정
  const editBtn = document.querySelector('.post__btn--edit')

  editBtn.addEventListener('click', () => {
    location.href = `../newpost/index.html?postId=${post.post_id}`
  })

  //=================================댓글=================================

  const commentForm = document.getElementById('comment__form')
  const commentInput = document.getElementById('comment')
  // 댓글 더미 데이터 제거 (댓글 템플릿 리터럴 JS작성 후 HTML에서 코드 지우기!)
  // 아직 더미 댓글 남아 있어서 아래 댓글 숨기는 코드 작성)
  const commentList = document.querySelector('.comment__list')
  commentList.innerHTML = ''

  // 댓글 불러오기
  async function loadComments(postId) {
    // fetch(url) 기본값이 GET
    const res = await fetch(`http://localhost:4000/comments?post_id=${postId}`)
    const comments = await res.json()

    //답변 렌더링
    function renderComments(comments) {
      const list = document.querySelector('.comment__list')

      if (comments.length === 0) {
        list.innerHTML = `<p class='comment-empty'>첫 답변을 남겨보세요.</p>`
        return
      }

      list.innerHTML = comments
        .map((cmt) => {
          //빌드 시 src폴더 읽지 못함 assets폴더 public으로 옮겨서 경로 수정 필요!
          const avatar = cmt.profile_image || '/src/assets/icons/icon-user.svg'

          return `
              <li class="comment__item" data-id="${cmt.id}">
              <article class="comment__card">
              <!-- 댓글 작성자 프사 -->
              <div class="comment__avatar" >
              <img class="comment__avatar-image" src="${avatar}" alt="" />

              </div>
              <!-- 댓글 작성자 메타 정보 -->

              <div class="comment__meta">
                <span class="comment__author">${cmt.nickname}</span>
                <time class="comment__time">
                ${new Date(cmt.create_date).toLocaleString()}
                  </time>
              </div>

              <!-- 댓글 내용 -->
              <p class="comment__text">
                ${cmt.content}
              </p>
            </article>
          </li>
      `
        })
        .join('')
    }

    renderComments(comments)
  }

  // submit 이벤트
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const content = commentInput.value.trim()
    if (!content) return

    const newComment = {
      post_id: Number(postId),
      nickname: '사용자', //나중에 로그인 연결 currentUser.nickname,
      // profile_image: currentUser.profile_image,
      content,
      create_date: new Date().toISOString(),
    }

    await fetch('http://localhost:4000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    })

    commentInput.value = ''
    loadComments(postId)
  })
}

init()
