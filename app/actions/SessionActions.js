import {
  USER_SIGNIN,
  USER_SIGNOUT
} from 'constants'
import auth from 'lib/auth'
import Dispatcher from 'lib/dispatcher'
import jwt_decode from 'jwt-decode'
import membershipInvite from 'lib/membershipInvite'

export default {
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
  }
}
