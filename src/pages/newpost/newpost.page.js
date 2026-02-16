const form = document.querySelector('.newpost__form')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(form)

  const data = {
    category: formData.get('gategorySelect'),
    title: formData.get('title'),
    content: formData.get('content'),
  }

  console.log(data)
})
