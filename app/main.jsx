require('babel/polyfill')

import './stylesheets/application.css'
import Routes from './routes/index.js.jsx'
import Router from 'react-router'
import React from 'react'
import RouterContainer from './lib/router_container'
import SessionActions from './actions/session_actions'
import url from 'url'
import segment from './lib/segment'

import './images/favicon.ico'
import 'isomorphic-fetch'

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
  segment.track('Page view', {
    path: state.path,
    routeName: state.routes[state.routes.length-1].name
  })
})
