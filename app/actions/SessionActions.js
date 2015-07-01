import {
  USER_SIGNIN,
  USER_SIGNOUT
} from 'constants'
import auth from 'lib/auth'
import Dispatcher from 'lib/dispatcher'
import jwt_decode from 'jwt-decode'
import membershipInvite from 'lib/membershipInvite'
import RouterContainer from 'lib/router_container'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupConfirmationForm from 'components/Authentication/SignupConfirmationForm.jsx'

export default {
  initializeTwitterSignIn(returnUrl) {
    if (typeof returnUrl !== 'string') {
      returnUrl = null
    }

    window.location.href = `${API_URL}/auth/twitter?origin=${returnUrl || window.location.href}`
  },

  linkTwitterAccount(userId, returnUrl="/settings") {
    if (typeof returnUrl !== 'string') {
      returnUrl = null
    }

    window.location.href = `${API_URL}/auth/twitter?origin=${returnUrl || window.location.href}&user_id=${userId}`
  },

  signin(returnUrl) {
    if (typeof returnUrl !== 'string') {
      returnUrl = ''
    }

    let query = `return_url=${encodeURIComponent(returnUrl || window.location.href)}`

    if (RouterContainer.customDomain) {
      query = `${query}&changelog=${RouterContainer.customDomain}`
    }

    fetch(`${API_URL}/sessions/new`, {
      method: 'GET'
    }).then(resp => resp.json())
      .then(json => { window.location.href = json.url })
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
    user = (user || jwt_decode(jwt).user)
    Dispatcher.dispatch({
      type: USER_SIGNIN,
      jwt: jwt,
      user: user
    })
    return user
  },

  signout() {
    auth.remove()
    membershipInvite.remove()
    Dispatcher.dispatch({
      type: USER_SIGNOUT
    })
    window.location = '/'
  },

  twitterCallback(query) {
    const { return_url, provider, uid, username } = query
    let data = new FormData()
    data.append('provider', provider)
    data.append('uid', uid)

    fetch(`${API_URL}/twitter/signin`, {
      method: 'POST',
      body: data
    }).then(resp => resp.json()).then(json => {
      if (json.token) {
        this.signinFromToken(json.token)
        window.location.href = return_url
      } else {
        SigninScrimActions.initialize(SignupConfirmationForm, query, return_url)
      }
    })
  }
}
