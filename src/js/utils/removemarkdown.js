export function removeMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`.*?`/g, '')
    .replace(/[#*_\-~[\]()>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
