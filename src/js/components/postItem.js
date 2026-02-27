import { timeForToday } from '../utils/date.js'

export const postItem = (post) => {
  return `
    <li class="post__item" data-category="${post.typeIndex}" data-id="${post.post_id}">
      <a href="#" class="post__inner">

        <div class="post__top-row">
          <span class="post__tag">${post.type}</span>
          <span class="post__date">
                        <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.00016 14.6668C11.6821 14.6668 14.6668 11.6821 14.6668 8.00016C14.6668 4.31826 11.6821 1.3335 8.00016 1.3335C4.31826 1.3335 1.3335 4.31826 1.3335 8.00016C1.3335 11.6821 4.31826 14.6668 8.00016 14.6668Z"
                  stroke="#6A7282"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 4V8L10.6667 9.33333"
                  stroke="#6A7282"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
          ${timeForToday(post.create_date)}</span>
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
