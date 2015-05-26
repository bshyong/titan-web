export default (func, context = null, t = 200) => {
  let timeout

  return () => {
    let later = () => {
      timeout = null
      func.apply(context)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, t)
  }
}
