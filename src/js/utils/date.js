export function timeForToday(value) {
  console.log(value)
  if (!value) return ''

  // 💡 특수 공백과 일반 공백을 모두 제거하고 표준 포맷으로 변경
  const cleanValue = value.toString().replace(/\s+/g, ' ').trim()
  const today = new Date()
  let timeValue

  // 💡 한국 시차 보정 로직 강화
  if (cleanValue.length <= 10) {
    timeValue = new Date(cleanValue + 'T00:00:00+09:00')
  } else {
    // 💡 서버 시간이 이미 한국 시간(KST)이라면 +09:00을 붙여야 중복 계산이 안 됩니다.
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

  // 미래 시간 방어 (시차 계산 시 미세한 초 차이 발생 가능)
  if (betweenTime < 1) return '방금 전'
  if (betweenTime < 60) return `${betweenTime}분 전`

  const hour = Math.floor(betweenTime / 60)
  if (hour < 24) return `${hour}시간 전`

  const day = Math.floor(hour / 24)
  if (day < 365) return `${day}일 전`

  return `${Math.floor(day / 365)}년 전`
}
