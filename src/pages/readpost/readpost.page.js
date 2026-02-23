// 마크다운 라이브러리
// sanitize 라이브러리
import { timeForToday } from '../../js/utils/date.js'
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/+esm'

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
  const response = await fetch(
    `http://leedh9276.dothome.co.kr/likelion-vanilla/board/read.php?post_id=${postId}`,
  )

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

  // 콘솔로 한 번 더 확인!
  console.log('최종 추출된 post:', post)

  if (!post || Object.keys(post).length === 0) {
    console.log('글 없음 - 데이터 구조를 확인해야 합니다.')
    return
  }

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
  document.querySelector('.post__author-name').textContent =
    post.user_nickname || post.nickname || '사용자'

  // 시간 렌더링
  const timeElement = document.querySelector('.post__time time')

  if (post.create_date && timeElement) {
    timeElement.textContent = timeForToday(post.create_date)
    timeElement.setAttribute('datetime', post.create_date.replace(' ', 'T'))
  }

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
    // 1. 데이터 가져오기
    const res = await fetch(
      `https://leedh9276.dothome.co.kr/likelion-vanilla/comment/read.php?post_id=${postId}`,
    )

    // 2. 변수 이름을 result로 통일하거나 아래를 맞추거나!
    const result = await res.json() // 💡 여기서 comments 대신 result로 받는게 안 헷갈립니다.
    console.log('서버에서 온 알맹이 데이터:', result)
    // 답변 렌더링 함수
    const realData = result.data || result
    function renderComments(data) {
      // 💡 매개변수 이름을 data로 명확히!
      const list = document.querySelector('.comment__list')

      // 💡 [방어막] 데이터가 배열인지 확인 (백엔드에서 "댓글이 없습니다"가 올 경우 대비)
      const commentList = Array.isArray(data) ? data : []

      if (commentList.length === 0) {
        list.innerHTML = `<p class='comment-empty'>첫 답변을 남겨보세요.</p>`
        return
      }

      list.innerHTML = commentList
        .map((cmt) => {
          //빌드 시 src폴더 읽지 못함 assets폴더 public으로 옮겨서 경로 수정 필요!
          const avatar = cmt.profile_image || '/src/assets/icons/icon-user.svg'

          return `
              <li class="comment__item" data-id="${cmt.comment_id}">
                <article class="comment__card">
                  <div class="comment__avatar" >
                    <img class="comment__avatar-image" src="${avatar}" alt="" />
                  </div>
                  <div class="comment__meta">
                    <span class="comment__author">${cmt.user_nickname || '익명'}</span>
                    <time class="comment__time">
                      ${new Date(cmt.create_date).toLocaleString()}
                    </time>
                  </div>
                  <p class="comment__text">
                    ${cmt.contents}
                  </p>
                </article>
              </li>
          `
        })
        .join('')
    }
    renderComments(realData)
  }

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const contentValue = commentInput.value.trim()
    if (!contentValue) return

    const formData = new FormData()
    formData.append('post_id', postId)
    formData.append('user_id', 1)
    formData.append('content', contentValue)

    try {
      const response = await fetch(
        'https://leedh9276.dothome.co.kr/likelion-vanilla/comment/write.php',
        {
          method: 'POST',
          body: formData,
        },
      )
      const text = await response.text()
      console.log('서버 최종 답변:', text)
      if (text.includes('success')) {
        commentInput.value = ''

        setTimeout(async () => {
          await loadComments(postId)
          console.log('실시간 반영 완료!')
        }, 300)
      }
    } catch (err) {
      console.error(err)
    }
  })
}

init()
