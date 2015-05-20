import { RESOURCE_NOT_FOUND, RESOURCE_FOUND } from '../constants'

import Dispatcher from '../lib/dispatcher'
import 'isomorphic-fetch'
import SessionStore from '../stores/session_store'
import api from '../lib/api'

module.exports = Object.create(api, {
  req: {
    value: (url, options) => {
      options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      if (SessionStore.jwt) {
        options.headers['Authorization'] = 'Bearer ' + SessionStore.jwt
      }

      return fetch(url, options).
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
})
