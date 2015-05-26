export default (msg) => {
  return () => {
    if (__DEV__) {
      console.warn(msg)
    }
  }
}
