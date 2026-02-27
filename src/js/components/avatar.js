import { BASE_URL } from '../../api/api'
export function renderAvatar(profile, name) {
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
