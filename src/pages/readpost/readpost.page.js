// 마크다운 라이브러리
// sanitize 라이브러리

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'

// 키값(글의 고유 번호-postId) 꺼내 오기 위해 변수로 선언
const postId = localStorage.getItem('selectedPostId')

async function init() {
  const response = await fetch('http://localhost:4000/posts')
  const posts = await response.json()
  // 지금 클릭한 글(post) id랑 같은 글 하나 찾아서(find) post에 넣어라
  const post = posts.find((post) => String(post.post_id) === String(postId))
  if (!post) return

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

  // 삭제

  const deleteBtn = document.querySelector('.post__btn--delete')

  deleteBtn.addEventListener('click', async () => {
    const ok = confirm('정말 글을 삭제하시겠습니까?')
    if (!ok) return

    await fetch(`http://localhost:4000/posts/${post.id}`, {
      method: 'DELETE',
    })

    if (post.board_id === 2) {
      location.href = '..qna/index.html'
    } else {
      location.href = '../studyroom/index.html'
    }
  })

  // 수정
  const editBtn = document.querySelector('.post__btn--edit')

  editBtn.addEventListener('click', () => {
    location.href = `../newpost/index.html?postId=${post.id}`
  })
}


init()
