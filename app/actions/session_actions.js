import { USER_SIGNIN, USER_SIGNOUT } from '../constants'
import auth from '../lib/auth'
import Dispatcher from '../lib/dispatcher'
import jwt_decode from 'jwt-decode'
import RouterContainer from '../lib/router_container'

export default {
  signin() {
    let query = `return_url=${encodeURIComponent(window.location.href)}`

    if (RouterContainer.customDomain) {
      query = `${query}&changelog=${RouterContainer.customDomain}`
    }

    fetch(`${API_URL}/sessions/new?${query}`, {
      method: 'GET'
    }).then(resp => resp.json()).
       then(json => { window.location.href = json.url })
  },

  signinFromSSO(payload, sig) {
    var data = new FormData()
    data.append('payload', payload)
    data.append('sig', sig)

    fetch(`${API_URL}/sessions/sso_signin`, {
      method: 'POST',
      body: data
    }).then(resp => resp.json()).then(resp => {
      this.signinFromToken(resp.token)
      window.location.href = resp.return_url
    })
  },

  signinFromToken(jwt, user) {
    auth.set(jwt)
    Dispatcher.dispatch({
      type: USER_SIGNIN,
      jwt: jwt,
      user: (user || jwt_decode(jwt).user)
    })
  },

  signout() {
    auth.remove()
    Dispatcher.dispatch({
      type: USER_SIGNOUT
    })
    window.location = '/'
  }
}
