import { USER_SIGNIN, USER_SIGNOUT } from 'constants'
import Dispatcher from '../lib/dispatcher'
import jwt_decode from 'jwt-decode'
import request from 'reqwest'
import RouterContainer from 'lib/router_container'

export default {
  signin() {
    request({
      url: `${API_URL}/sessions/new`,
      method: 'get',
      data: {
        return_url: window.location.pathname
      },
      error: (err) => {},
      success: (resp) => {
        window.location = resp.url
      }
    })
  },

  signinFromSSO(payload) {
    request({
      url: `${API_URL}/sessions/sso_signin`,
      method: 'post',
      data: payload,
      error: (err) => {},
      success: (resp) => {
        this.signinFromToken(resp.token)
        // This is a hack to let the mobile app know who we are
        window.location = `${resp.return_url}?u=${jwt_decode(resp.token).user.username}`
        RouterContainer.get().transitionTo(resp.return_url);
      }
    })
  },

  signinFromToken(jwt) {
    localStorage.setItem('jwt', jwt)
    Dispatcher.dispatch({
      type: USER_SIGNIN,
      jwt: jwt
    })
  },

  signout() {
    localStorage.removeItem('jwt')
    Dispatcher.dispatch({
      type: USER_SIGNOUT
    })
  }
}
