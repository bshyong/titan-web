import segment from 'lib/segment'

export default function clientMiddleware(api) {
  return (next) => (action) => {
    const { promise, types, analytics, ...rest } = action

    if (!promise) {
      return next(action)
    }

    const [REQUEST, SUCCESS, FAILURE] = types
    next({...rest, type: REQUEST})
    return promise(api).then(
      resp => {
        if (analytics) {
          segment.track.apply(this, analytics)
        }
        return next({...rest, resp, type: SUCCESS})
      }
    ).catch(
      errors => {
        console && console.error(errors)
        return next({...rest, errors, type: FAILURE})
      }
    )
  }
}
