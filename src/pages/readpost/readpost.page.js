/* ================================
   Imports
================================= */
import { checkToken } from '../../api/JWT.js'
import { timeForToday } from '../../js/utils/date.js'
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'
import { BASE_URL } from '../../api/api.js'
import { renderAvatar } from '../../js/components/avatar.js'

/* ================================
   API Request Helper
================================= */
// async function request(url, options = {}) {
//   const response = await fetch(url, options)

//   if (!response.ok) {
//     throw new Error(`Error: ${response.status}`)
//   }

//   const contentType = response.headers.get('content-type')

//   if (contentType && contentType.includes('application/json')) {
//     return await response.json()
//   }

//   return await response.text()
// }

/* ================================
   State
================================= */
let currentUser = null

const params = new URLSearchParams(location.search)
const postId = params.get('postId') || localStorage.getItem('selectedPostId')
const boardId = localStorage.getItem('selectedBoardId')
const USERPAGE_BASE = `http://leedh9207.dothome.co.kr/src/pages/users/user_page/index.html?`
function getUserPageLink(uid) {
  return `${USERPAGE_BASE}${uid}`
}

/* ================================
   DOM caching
================================= */
const commentSection = document.getElementById('comment-area')
const postContent = document.querySelector('.post__content')
const timeElement = document.querySelector('.post__time time')
const commentList = document.querySelector('.comment__list')
const commentInput = document.getElementById('comment')
const editBtn = document.querySelector('.post__btn--edit')
const deleteBtn = document.querySelector('.post__btn--delete')
const authorAvatar = document.querySelector('.post__author-avatar')
const commentForm = document.getElementById('comment__form')
const actions = document.querySelector('.post__actions')
const categoryEl = document.querySelector('.post__category')
const titleEl = document.querySelector('.post__title')
const authorNameEl = document.querySelector('.post__author-name')

// 로그인한 회원만 글에 접근
start()

async function start() {
  currentUser = await checkToken() // 유저 확인 로직

  if (!currentUser) {
    alert('로그인이 필요합니다.')
    window.location.href = '/src/pages/users/login/index.html'
    return
  }

  console.log('로그인 성공, 페이지 로드를 시작합니다.')
  await init()
}

// fetch한 글 렌더링
async function init() {
  toggleCommentsSection()

  const post = await fetchPost()
  if (!post) return

  renderPost(post)
  await loadComments(post.post_id)
  bindEvents(post)
}

// 글 데이터 fetch로 불러오기
async function fetchPost() {
  const response = await fetch(`${BASE_URL}/board/read.php?post_id=${postId}`)
  if (!response.ok) throw new Error('글 불러오기 실패')

  const result = await response.json()

  let post = null
  if (Array.isArray(result)) {
    post = result[0]
  } else if (result.data) {
    post = Array.isArray(result.data) ? result.data[0] : result.data
  } else {
    post = result
  }

  if (!post || Object.keys(post).length === 0) {
    console.log('글 없음 - 데이터 구조를 확인해야 합니다.')
    return
  }

  return post
}

// 자습방 댓글 기능 숨기기
function toggleCommentsSection() {
  if (boardId === '1') {
    commentSection.style.display = 'none'
  } else {
    commentSection.style.display = 'block'
  }
}

function renderPost(post) {
  marked.setOptions({ breaks: true })
  const rawHtml = marked.parse(post.contents || '')
  const sanitizedHtml = DOMPurify.sanitize(rawHtml) // 사용자가 쓴 script를 읽지 않게 하기 위해서 (XSS방지)

  postContent.innerHTML = sanitizedHtml

  postContent.querySelectorAll('pre').forEach((pre) => {
    pre.classList.add('post__content--code')
  })

  categoryEl.textContent = Array.isArray(post.type) ? post.type[0] : post.type

  titleEl.textContent = post.subject
  const authorNickname = post.user_nickname
  authorNameEl.textContent = authorNickname

  const profileLink = getUserPageLink(post.user_id)
  authorAvatar.innerHTML = `
  <a href="${profileLink}">
    ${renderAvatar(post.user_profile, authorNickname)}
  </a>
`

  // 시간 렌더링
  if (post.create_date && timeElement) {
    timeElement.textContent = timeForToday(post.create_date)
    timeElement.setAttribute('datetime', post.create_date.replace(' ', 'T'))
  }

  postActions(post)
}

// 글 작성자에게만 수정/삭제 버튼 노출
function postActions(post) {
  if (!currentUser || Number(currentUser.UID) !== Number(post.user_id)) {
    actions.style.display = 'none'
  }
}

// 댓글 불러오기
async function loadComments(postId) {
  const res = await fetch(`${BASE_URL}/comment/read.php?post_id=${postId}`)
  const result = await res.json()
  const data = result.data || result
  const comments = Array.isArray(data) ? data : []

  renderComments(comments)
}

function renderComments(comments) {
  commentList.innerHTML = comments
    .map((cmt) => {
      console.log(cmt)

      // 댓글 작성자에게만 수정/삭제 버튼 노출
      const isOwner = currentUser && Number(currentUser.UID) === Number(cmt.UID)
      const profileLink = getUserPageLink(cmt.UID)
      return `
      <li class="comment__item" data-id="${cmt.comment_id}">
        <article class="comment__card">
          <div class="comment__avatar">
          <a href="${profileLink}">
            ${renderAvatar(cmt.user_profile, cmt.user_nickname)}
            </a>
          </div>
          <div class="comment__meta">
            <span class="comment__author">${cmt.user_nickname}</span>
            <time class="comment__time">
              ${new Date(cmt.create_date).toLocaleString()}
            </time>
          </div>
          <p class="comment__text">
            ${DOMPurify.sanitize(cmt.contents)}
            </p>
            ${
              isOwner
                ? `
            <div class = "comment__actions">
            <button class = "comment__edit">수정</button>
            <button class = "comment__delete">삭제</button>
            </div>`
                : ''
            }
        </article>
      </li>
    `
    })
    .join('')
}

function bindEvents(post) {
  // 글 삭제
  deleteBtn.addEventListener('click', async () => {
    // 컨펌
    const ok = confirm('정말 글을 삭제하시겠습니까?')
    if (!ok) return

    try {
      const uid = currentUser?.UID

      if (!uid) {
        alert('로그인이 필요합니다.')
        window.location.href = '/src/pages/users/login/index.html'
        return
      }

      // api
      const response = await fetch(`${BASE_URL}/board/delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid,
          post_id: post.post_id,
        }),
      })

      // 이동
      const result = await response.text()
      console.log('삭제 응답:', result)

      if (result.includes('success')) {
        alert('삭제 완료')

        if (Number(boardId) === 2) {
          location.href = '../qna/index.html'
        } else {
          location.href = '../studyroom/index.html'
        }
      } else {
        alert('삭제 실패')
      }
    } catch (err) {
      console.error(err)
    }
  })

  // 글 수정
  editBtn.addEventListener('click', () => {
    location.href = `../newpost/index.html?postId=${post.post_id}`
  })

  // 댓글 작성
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const contentValue = commentInput.value.trim()
    if (!contentValue) return

    const formData = new FormData()

    formData.append('post_id', postId)
    formData.append('user_id', currentUser.UID)
    formData.append('content', contentValue)

    try {
      const response = await fetch(`${BASE_URL}/comment/write.php`, {
        method: 'POST',
        body: formData,
      })
      const text = await response.text()
      console.log('서버 최종 답변:', text)
      if (text.includes('success')) {
        commentInput.value = ''
        await loadComments(postId)
      }
    } catch (err) {
      console.error(err)
    }
  })

  // 댓글 삭제
  commentList.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.comment__delete')
    if (!deleteBtn) return

    const commentItem = deleteBtn.closest('.comment__item')
    const commentId = commentItem.dataset.id
    const ok = confirm('댓글을 삭제하시겠습니까?')
    if (!ok) return

    try {
      const formData = new FormData()
      formData.append('comment_id', commentId)
      formData.append('user_id', currentUser.UID)

      const res = await fetch(`${BASE_URL}/comment/delete.php`, {
        method: 'POST',
        body: formData,
      })

      const text = await res.text()
      console.log('삭제 응답 :', text)

      if (text.includes('success')) {
        commentItem.remove()
      } else {
        alert('삭제 실패')
      }
    } catch (err) {
      console.error(err)
    }
  })

  // 댓글 수정 기능 준비중
  // TODO: 수정 기능 구현 (P2)
  commentList.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.comment__edit')
    if (!editBtn) return

    alert('현재 준비중인 기능입니다.')
  })
}

