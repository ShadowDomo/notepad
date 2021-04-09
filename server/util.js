// generates a random alphanumeric key of given length
function generateRandomKey(length) {
  const legalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  let result = ''
  for (let i = 0; i < length; ++i) {
    let d = Math.floor((Math.random() * legalChars.length))
    result = result.concat(legalChars[d])
  }

  return result
}

export { generateRandomKey }