export default (array) => {
  let remaining = array.length

  while (remaining > 0) {
    const randomIndex = Math.floor(Math.random() * remaining--)
    const temp = array[remaining]
    array[remaining] = array[randomIndex]
    array[randomIndex] = temp
  }

  return array
}
