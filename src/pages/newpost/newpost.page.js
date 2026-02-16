// 마크다운 라이브러리

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('content')
  const preview = document.getElementById('previewContent')

  marked.setOptions({ breaks: true })

  function renderPreview() {
    const markdown = textarea.value.trim()

    if (!markdown) {
      preview.innerHTML = '<p>여기에 미리보기가 표시됩니다.</p>'
      return
    }

    preview.innerHTML = marked.parse(markdown)
  }

  textarea.addEventListener('input', renderPreview)
  // renderPreview()
})

// 작성완료 후 게시물 목록으로 이동
const form = document.querySelector('.newpost__form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  console.log('글 작성 폼 제출됨')

  const formData = new FormData(form)

  const data = {
    boardType: formData.get('boardType'),
    category: formData.get('categorySelect'),
    title: formData.get('title'),
    content: formData.get('content'),
    createdAt: new Date().toISOString(),
  }

  try {
    const response = await fetch('http://localhost:4000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('저장 실패')

    alert('글이 저장되었습니다')

    // 작성 완료 후 선택한 게시판 리스트로 이동
    // src 폴더는 배포 후 사라지므로  상대경로를 이용하여 이동시킴 (location.href = `/src/pages/${board}/index.html` ❌)
    const board = formData.get('boardType')

    location.href =
      board === 'qna' ? '../qna/index.html' : '../studyroom/index.html'

    form.reset()
  } catch (error) {
    console.error(error)
    alert('에러 발생')
  }
})
