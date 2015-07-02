import { createRedux, createDispatcher, composeStores } from 'redux'
import middleware from './clientMiddleware'
import thunkMiddleware from 'redux/lib/middleware/thunk'
import * as stores from 'stores/index'

const store = composeStores(stores)

export default function(client, data) {
  const dispatcher = createDispatcher(store, (getState) =>
    [middleware(client), thunkMiddleware(getState)]
  )

  return createRedux(dispatcher, data)
}
