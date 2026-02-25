import { timeForToday } from '../utils/date.js'

export const postItem = (post) => {
  return `
    <li class="post__item" data-category="${post.typeIndex}" data-id="${post.post_id}">
      <a href="#" class="post__inner">

        <div class="post__top-row">
          <span class="post__tag">${post.type}</span>
          <span class="post__date">${timeForToday(post.create_date)}</span>
        </div>

        <div class="post__group">
          <h3 class="post__heading">${post.subject}</h3>
          <p class="post__text">${post.contents}</p>
        </div>

        <div class="post__meta-box">
          <div class="post__author-row">
            <span class="post__comment-count">${post.commentCount}개의 댓글</span>
            <span class="post__author-text">by <strong>${post.user_nickname}</strong></span>
          </div>
        </div>

      </a>
    </li>
  `
}
