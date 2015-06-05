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
import url from 'url'

let jwt = localStorage.getItem('jwt')
if (jwt) {
  SessionActions.signinFromToken(jwt)
}

// Monkey patch to make hashes in urls work
Router.HistoryLocation.getCurrentPath = function getCurrentPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var hash = window.location.href.split('#')[1] || ''
  if(hash) {
    hash = "#" + hash
  }

  return decodeURI(
    window.location.pathname + window.location.search + hash
  );
}

var router = Router.create({
  routes: Routes,
  location: Router.HistoryLocation
})
RouterContainer.set(router)

router.run((Handler, state) => {
  React.render(<Handler />, document.body)
  segment.page()
  Dispatcher.dispatch({type: ROUTE_TRANSITIONED})
})
