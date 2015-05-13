import { RESOURCE_NOT_FOUND, RESOURCE_FOUND } from '../constants'

import Dispatcher from '../lib/dispatcher'
import SessionStore from '../stores/session_store'

module.exports = {
  get(url) {
    return this.req(url, {
      method: 'GET'
    })
  },

  put(url, data = {}) {
    return this.req(url, {
      body: JSON.stringify(data),
      method: 'PUT'
    })
  },

  post(url, data) {
    return this.req(url, {
      body: JSON.stringify(data),
      method: 'POST'
    })
  },

  delete(url, data) {
    return this.req(url, {
      body: JSON.stringify(data),
      method: 'DELETE'
    })
  },

  req(url, options) {
    options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (SessionStore.jwt) {
      options.headers['Authorization'] = 'Bearer ' + SessionStore.jwt
    }

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
  }
}
