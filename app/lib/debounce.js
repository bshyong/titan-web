export default (func, context = null, args = [], t = 200) => {
  let timeout

  return () => {
    let later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, t)
  }
}
