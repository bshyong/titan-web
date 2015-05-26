export default (array) => {
  array = array.slice(0)

  array.forEach((value, index) => {
    let j = Math.floor(Math.random() * (index + 1))
    array[index] = array[j]
    array[j] = value
  })

  return array
}
