// 마크다운 라이브러리
// sanitize 라이브러리
import { checkToken } from '../../api/JWT.js'
import { timeForToday } from '../../js/utils/date.js'
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'

let currentUser = null
const BASE_URL = 'https://leedh9276.dothome.co.kr/likelion-vanilla'

//글, 댓글 작성자 프로필 이미지 가져오기
function renderAvatar(profile, name) {
  const firstChar = name.charAt(0)

  if (profile) {
    return `
      <div class="avatar">
        <img class="avatar__image"
             src="${BASE_URL}/users/uploads/profile/${profile}"
             alt="${name}" />
      </div>
    `
  }
  return `
    <div class="avatar avatar--initial">
      ${firstChar}
    </div>
  `
}

// 로그인한 회원만 글에 접근
async function start() {
  currentUser = await checkToken() // 유저 확인 로직

  if (!currentUser) {
    alert('로그인이 필요합니다.')
    window.location.href = '/src/pages/users/login/index.html'
    return // 이제 함수 안이므로 정상 작동합니다.
  }

  // 로그인했을 때만 실행될 나머지 코드들...
  console.log('로그인 성공, 페이지 로드를 시작합니다.')

  await init()
}

start()

// 키값(글의 고유 번호-postId) 꺼내 오기 위해 변수로 선언
const params = new URLSearchParams(location.search)
const postId = params.get('postId') || localStorage.getItem('selectedPostId')
console.log('읽으려는 postId', postId)
const boardId = localStorage.getItem('selectedBoardId')

const currentBoardId = localStorage.getItem('selectedBoardId') // 아까 저장한 1 또는 2
const commentSection = document.getElementById('comment-area')

if (currentBoardId === '1') {
  commentSection.style.display = 'none' // 또는 .classList.add('hidden')
} else {
  commentSection.style.display = 'block'
}

async function init() {
  const response = await fetch(`${BASE_URL}/board/read.php?post_id=${postId}`)

  if (!response.ok) throw new Error('글 불러오기 실패')
  const result = await response.json()
  console.log('서버 원본 응답:', result)

  // 💡 [수정 포인트] 상자 구조가 어떤 모양이든 찾아내는 무적 로직
  // 1. result 자체가 배열이면 첫 번째 값
  // 2. result.data가 있으면 그 안의 첫 번째 값 혹은 객체
  // 3. 둘 다 아니면 result 자체를 객체로 취급
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

  console.log('user_id', post.user_id)
  console.log('작성자 user_profile:', post.user_profile)

  // 선택된 글 렌더링 (마크다운 문법-특정 css적용)
  marked.setOptions({
    breaks: true,
  })

  const rawHtml = marked.parse(post.contents || '')
  const sanitizedHtml = DOMPurify.sanitize(rawHtml) // 사용자가 쓴 script를 읽지 않게 하기 위해서 (XSS방지)

  const postContent = document.querySelector('.post__content')
  postContent.innerHTML = sanitizedHtml

  postContent.querySelectorAll('pre').forEach((pre) => {
    pre.classList.add('post__content--code')
  })
  document.querySelector('.post__category').textContent = Array.isArray(
    post.type,
  )
    ? post.type[0]
    : post.type
  document.querySelector('.post__title').textContent = post.subject
  const authorNickname = post.user_nickname || post.nickname || '사용자'
  document.querySelector('.post__author-name').textContent = authorNickname
  const authorAvatar = document.querySelector('.post__author-avatar')

  authorAvatar.innerHTML = renderAvatar(post.user_profile, authorNickname)

  // 시간 렌더링
  const timeElement = document.querySelector('.post__time time')

  if (post.create_date && timeElement) {
    timeElement.textContent = timeForToday(post.create_date)
    timeElement.setAttribute('datetime', post.create_date.replace(' ', 'T'))
  }

  loadComments(post.post_id, currentUser)

  // 삭제

  const deleteBtn = document.querySelector('.post__btn--delete')

  deleteBtn.addEventListener('click', async () => {
    const ok = confirm('정말 글을 삭제하시겠습니까?')
    if (!ok) return

    try {
      const uid = currentUser?.UID

      if (!uid) {
        alert('로그인이 필요합니다.')
        window.location.href = '/src/pages/users/login/index.html'
        return
      }

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
  async function loadComments(postId, currentUser) {
    // 1. 데이터 가져오기
    const res = await fetch(`${BASE_URL}/comment/read.php?post_id=${postId}`)

    // 2. 변수 이름을 result로 통일하거나 아래를 맞추거나!
    const result = await res.json() // 💡 여기서 comments 대신 result로 받는게 안 헷갈립니다.
    console.log('서버에서 온 알맹이 데이터:', result)
    // 답변 렌더링 함수
    const realData = result.data || result
    console.log('댓글 데이터 확인:', realData)
    function renderComments(data, currentUser) {
      //  매개변수 이름을 data로 명확히!
      const list = document.querySelector('.comment__list')

      // [방어막] 데이터가 배열인지 확인 (백엔드에서 "댓글이 없습니다"가 올 경우 대비)
      const commentList = Array.isArray(data) ? data : []
      console.log('현재유저:', currentUser)
      list.innerHTML = commentList
        .map((cmt) => {
          console.log('댓글 작성자:', cmt.UID)
          console.log(cmt)
          const isOwner =
            currentUser && Number(currentUser.UID) === Number(cmt.UID)

          return `
      <li class="comment__item" data-id="${cmt.comment_id}">
        <article class="comment__card">
          <div class="comment__avatar">
            ${renderAvatar(cmt.user_profile, cmt.user_nickname)}
          </div>
          <div class="comment__meta">
            <span class="comment__author">${cmt.user_nickname}</span>
            <time class="comment__time">
              ${new Date(cmt.create_date).toLocaleString()}
            </time>
          </div>
          <p class="comment__text">
            ${cmt.contents}
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
    renderComments(realData, currentUser)
  }

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

        setTimeout(async () => {
          await loadComments(postId, currentUser)
          console.log('실시간 반영 완료!')
        }, 300)
      }
    } catch (err) {
      console.error(err)
    }
  })

  // ===== 글쓴이에게만 수정/삭제 버튼 노출 =====
  const actions = document.querySelector('.post__actions')

  try {
    if (!currentUser || Number(currentUser.UID) !== Number(post.user_id)) {
      actions.style.display = 'none'
    }
  } catch {
    // 로그인 안 한 경우
    actions.style.display = 'none'
  }

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
}


