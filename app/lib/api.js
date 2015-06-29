import {
  API_ERROR,
  RESOURCE_NOT_FOUND
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import invite from '../lib/invite'
import membership_invite from '../lib/membershipInvite'
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

    if (invite.get()) {
      options.headers['invite'] = invite.get()
    }

    if (membership_invite.get()) {
      options.headers['membership-invite'] = membership_invite.get()
    }

    let handleError = function handleError(resp) {
      if (resp.status === 404) {
        if (options.method.toLowerCase() === 'get') {
          Dispatcher.dispatch({ type: RESOURCE_NOT_FOUND })
          throw Error("404")
        }
        return resp.json().then(json => {
          throw json
        })
      } else if (resp.status === 500) {
        resp.json().then(json => {
          Dispatcher.dispatch({
            type: API_ERROR,
            error: json
          })
        })
        throw Error("API Error")
      } else if (resp.status === 400 || resp.status === 401) {
        return resp.json().then(json => {
          throw json
        })
      }
      return resp
    }

    return fetch(`${API_URL}/${url}`, options).
      then(handleError).
      then(resp => {
        if (resp.status === 204) {
          return resp
        }
        return resp.json()
      })
  }
}
