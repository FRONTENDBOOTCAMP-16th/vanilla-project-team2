export function timeForToday(value) {
  if (!value) return ''

  const cleanValue = value.toString().replace(/\s+/g, ' ').trim()
  const today = new Date()
  let timeValue

  if (cleanValue.length <= 10) {
    timeValue = new Date(cleanValue + 'T00:00:00+09:00')
  } else {
    const isoString = cleanValue.replace(' ', 'T')
    timeValue = new Date(
      isoString.includes('+') ? isoString : isoString + '+09:00',
    )
  }

  if (isNaN(timeValue.getTime())) {
    return '일시 확인 불가'
  }

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60,
  )

  if (betweenTime < 1) return '방금 전'
  if (betweenTime < 60) return `${betweenTime}분 전`

  const hour = Math.floor(betweenTime / 60)
  if (hour < 24) return `${hour}시간 전`

  const day = Math.floor(hour / 24)
  if (day < 365) return `${day}일 전`

  return `${Math.floor(day / 365)}년 전`
}
