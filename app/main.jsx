require('babel/polyfill')

import {
  ANALYTICS_ENGAGED,
  ROUTE_TRANSITIONED
} from './constants'
import './images/favicon.ico'
import './stylesheets/application.css'
import 'isomorphic-fetch'
import Dispatcher from './lib/dispatcher'
import React from 'react'
import Router from 'react-router'
import RouterContainer from './lib/router_container'
import Routes from './routes/index.js.jsx'
import segment from './lib/segment'
import SessionActions from './actions/session_actions'

let jwt = localStorage.getItem('jwt')
if (jwt) {
  SessionActions.signinFromToken(jwt)
}

// Monkey patch to make domains and hashes in urls work
Router.HistoryLocation.getCurrentPath = function getCurrentPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var hash = window.location.href.split('#')[1] || ''
  if(hash) {
    hash = "#" + hash
  }

  return decodeURI(
    window.location.pathname + window.location.search + hash
  )
}

RouterContainer.setRouters({
  internal: Router.create({
    routes: Routes.internal,
    location: Router.HistoryLocation
  }),

  external: Router.create({
    routes: Routes.external,
    location: Router.HistoryLocation
  }),
})
RouterContainer.setDomain(window.location.hostname)

RouterContainer.router.run((Handler, state) => {
  React.render(<Handler />, document.body)

  let route = state.routes[state.routes.length-1]
  segment.track(ANALYTICS_ENGAGED, {
    type: 'page_view',
    path: state.path,
    routeName: route ? route.name : '404'
  })

  Dispatcher.dispatch({type: ROUTE_TRANSITIONED})
})
