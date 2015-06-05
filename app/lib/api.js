import {
  API_ERROR,
  RESOURCE_NOT_FOUND,
  RESOURCE_FOUND
} from '../constants'

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

    let handleError = function handleError(resp) {
      if (resp.status == 404) {
        Dispatcher.dispatch({ type: RESOURCE_NOT_FOUND })
        throw Error("404")
      } else if (resp.status == 500) {
        resp.json().then(json => {
          Dispatcher.dispatch({
            type: API_ERROR,
            error: json
          })
        })
        throw Error("API Error")
      } else if (resp.status == 400) {
        return resp.json().then(json => {
          throw json
        })
      }
      return resp
    }

    return fetch(`${API_URL}/${url}`, options).
      then(handleError).
      then(resp => resp.json()).
      then(json => {
        Dispatcher.dispatch({ type: RESOURCE_FOUND })
        return json
      })
  }
}
