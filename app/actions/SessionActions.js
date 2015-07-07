import {
  USER_SIGNIN,
  USER_SIGNOUT
} from 'constants'
import auth from 'lib/auth'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import Dispatcher from 'lib/dispatcher'
import jwt_decode from 'jwt-decode'
import membershipInvite from 'lib/membershipInvite'
import RouterContainer from 'lib/router_container'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupConfirmationForm from 'components/Authentication/SignupConfirmationForm.jsx'
import url from 'url'

export default {
  initializeTwitterSignIn(opts) {
    let path = url.format({
      pathname: 'auth/twitter',
      query: opts
    })

    window.open(
      `${API_URL}/${path}`,
      'Sign in to Changelog with Twitter',
      'width=400,height=400,top=100,left=100'
    )
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

    fetch(`${API_URL}/auth/twitter/signin`, {
      method: 'POST',
      body: data
    }).then(resp => resp.json()).then(json => {
      if (json.token) {
        this.signinFromToken(json.token)
        window.location.href = url.parse(return_url).path
      } else {
        SigninScrimActions.initialize(SignupConfirmationForm, query, return_url)
      }
    })
  }
}
