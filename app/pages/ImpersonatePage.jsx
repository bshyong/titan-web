import api from '../lib/api'
import React from 'react'
import Router from '../lib/router_container'
import SessionActions from '../actions/SessionActions'

export default class ImpersonatePage extends React.Component {
  componentWillMount() {
    api.get(`users/${Router.router.getCurrentParams().userId}/impersonate`).then(resp => {
      let user = SessionActions.signinFromToken(resp.token)

      Router.router.transitionTo("profile", {userId: user.username})
    })
  }

  render() {
    return <div>Sup</div>
  }
}
