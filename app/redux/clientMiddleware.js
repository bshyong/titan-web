export default function clientMiddleware(api) {
  return (next) => (action) => {
    const { promise, types, ...rest } = action
    if (!promise) {
      return next(action)
    }

    const [REQUEST, SUCCESS, FAILURE] = types
    next({...rest, type: REQUEST})
    return promise(api).then(
      resp => next({...rest, resp, type: SUCCESS})
    ).catch(
      errors => next({...rest, errors, type: FAILURE})
    )
  }
}
