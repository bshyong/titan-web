import { USER_SIGNIN, USER_SIGNOUT } from 'constants'
import Dispatcher from '../lib/dispatcher'
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
        RouterContainer.get().transitionTo(resp.return_url, {}, {
          u: resp.username // This is a hack so the mobile app knows who we are
        });
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
