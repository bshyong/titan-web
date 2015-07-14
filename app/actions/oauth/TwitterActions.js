import {
  TWITTER_ACCOUNT_UNLINKED
} from 'constants'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'
import redirect from 'lib/redirect'
import SessionActions from 'actions/SessionActions'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupConfirmationForm from 'components/Authentication/SignupConfirmationForm.jsx'
import url from 'url'

export default {
  signIn(opts) {
    redirect.set(opts.redirectTo || window.location.href)

    delete opts.redirectTo

    const path = url.format({
      pathname: 'auth/twitter',
      query: opts
    })

    window.location.href = `${API_URL}/${path}`
  },

  callback(query) {
    const { provider, uid, username } = query
    let data = new FormData()
    data.append('provider', provider)
    data.append('uid', uid)
    data.append('username', username)

    return fetch(`${API_URL}/auth/twitter/signin`, {
      method: 'POST',
      body: data
    }).then(resp => resp.json()).then(json => {
      if (json.token) {
        SessionActions.signinFromToken(json.token)
        window.location.href = redirect.get()
      }
    })
  },

  unlink(userId) {
    api.delete(`auth/twitter/${userId}`).then(profile => {
      Dispatcher.dispatch({
        type: TWITTER_ACCOUNT_UNLINKED,
        profile: profile
      })
    })
  }
}
