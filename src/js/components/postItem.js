import { timeForToday } from '../utils/date.js'

export const postItem = (post) => {
  return `
    <li class="main-post__item" data-category="${post.typeIndex}" data-id="${post.post_id}">
  <a href="#" class="main-post__inner">
    
    <div class="main-post__top-row">
      <span class="main-post__tag">${post.type}</span>
      <span class="main-post__date">${timeForToday(post.create_date)}</span>
    </div>

    <div class="main-post__group">
      <h3 class="main-post__heading">${post.subject}</h3>
      <p class="main-post__text">${post.contents}</p>
    </div>
    
    <div class="main-post__meta-box">
      <div class="main-post__author-row">
        <span class="main-post__comment-count">${post.commentCount}개의 댓글</span>
        <span class="main-post__author-text">by <strong>${post.user_nickname}</strong></span>
      </div>
    </div>
    
  </a>
</li>
  `
}
