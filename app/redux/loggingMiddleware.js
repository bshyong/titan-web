export default function loggingMiddleware(getState) {
  return (next) => (action) => {
    console.info(action.type, action)
    // console.info(action.type, action, getState())
    return next(action)
  }
}
