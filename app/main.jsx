import Routes from './routes/index.js.jsx'
import Router from 'react-router'
import React from 'react'
import RouterContainer from './lib/router_container'
import SessionActions from './actions/session_actions'

import './images/favicon.ico'
import 'isomorphic-fetch'

let jwt = localStorage.getItem('jwt')
if (jwt) {
  SessionActions.signinFromToken(jwt)
}

var router = Router.create({
  routes: Routes,
  location: Router.HistoryLocation
})
RouterContainer.set(router)

router.run((Handler) => {
  React.render(<Handler />, document.body)
})
