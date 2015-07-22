export default (func, context = null, args = [], t = 200) => {
  let timeout

  return () => {
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, t)
  }
}

export function debounceFunc(func, wait, immediate) {
  var timeout, args, context, timestamp, result

  const later = function later() {
    const last = (new Date()).getTime() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function debounced() {
    context = this
    args = arguments
    timestamp = (new Date()).getTime()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
