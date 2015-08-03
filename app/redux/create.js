import { createRedux, createDispatcher, composeStores } from 'redux'
import * as stores from 'stores/index'
import clientMiddleware from './clientMiddleware'
import loggingMiddleware from './loggingMiddleware'
import thunkMiddleware from 'redux/lib/middleware/thunk'

const store = composeStores(stores)

export default function(client, data) {
  const dispatcher = createDispatcher(store, (getState) => {
    const middleware = [
      clientMiddleware(client),
      thunkMiddleware(getState),
    ]
    if (__DEV__) {
      middleware.push(loggingMiddleware(getState))
    }
    return middleware
  })

  return createRedux(dispatcher, data)
}
