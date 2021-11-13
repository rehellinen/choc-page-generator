export const isObject = (val: any) => val !== null && typeof val === 'object'
export const isString = (val: any) => typeof val === 'string'
export const isFunction = (val: any) => typeof val === 'function'

export const parseText = (text: string) => {
  const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  if (!tagRE.test(text)) {
    return {
      isStatic: true,
      exp: JSON.stringify(text)
    }
  }

  const tokens: any[] = []
  let index
  let lastIndex = 0
  tagRE.lastIndex = 0

  let match = tagRE.exec(text)
  while (match) {
    const [matchedStr, exp] = match
    index = match.index

    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)))
    }
    tokens.push(`(${exp.trim()})`)
    lastIndex = index + matchedStr.length

    match = tagRE.exec(text)
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }

  return {
    isStatic: false,
    exp: tokens.join('+')
  }
}
