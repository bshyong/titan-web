import { RESOURCE_NOT_FOUND, RESOURCE_FOUND } from 'constants'

import Dispatcher from 'lib/dispatcher'
import 'whatwg-fetch'
import SessionStore from 'stores/session_store'

module.exports = {
  get(url) {
    return this.req(url, {
      method: 'GET',
      headers: this.headers()
    })
  },

  post(url, data) {
    return this.req(url, {
      data: data,
      method: 'POST',
      headers: this.headers()
    })
  },

  req(url, options) {
    return fetch(`${API_URL}/${url}`, options).
      then(resp => resp.json()).
      then(json => {
        Dispatcher.dispatch({ type: RESOURCE_FOUND })
        return json
      }).
      catch(err => {
        if (err.status == 404) {
          Dispatcher.dispatch({ type: RESOURCE_NOT_FOUND })
        }
      })
  },

  headers() {
    if (SessionStore.jwt) {
      return {
        'Authorization': 'Bearer ' + SessionStore.jwt
      }
    }
  }
}
