require('babel/polyfill')

import {
  ANALYTICS_ENGAGED,
  ROUTE_TRANSITIONED
} from './constants'
import './images/favicon.ico'
import './stylesheets/application.css'
import 'isomorphic-fetch'
import api from 'lib/api'
import Dispatcher from './lib/dispatcher'
import React from 'react'
import Router from 'react-router'
import RouterContainer from './lib/router_container'
import Routes from './routes/index.js.jsx'
import segment from './lib/segment'
import SessionActions from './actions/SessionActions'
import url from 'url'

// Redirect old links to assembly.com
// TODO: use 301 when we have server side rendering
if (window.location.host === 'changelog.assembly.com') {
  let parts = url.parse(window.location.href)
  let to = `${parts.protocol}\/\/assembly.com${parts.path}`

  window.location.href = to
}


// redux
import createRedux from 'redux/create'
import { Provider } from 'redux/react'

let initialState = {}
let jwt = localStorage.getItem('jwt')
if (jwt) {
  const user = SessionActions.signinFromToken(jwt)
  initialState.currentUser = user
}
let redux = createRedux(api, initialState)

// Monkey patch to make domains and hashes in urls work
Router.HistoryLocation.getCurrentPath = function getCurrentPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var hash = window.location.href.split('#')[1] || ''
  if(hash) {
    hash = "#" + hash
  }

  let windowPath = decodeURI(
    window.location.pathname + window.location.search + hash
  )

  let parts = url.parse(windowPath)
  if (parts.pathname.length > 1 && parts.pathname.substr(-1) === '/') {
    parts.pathname = parts.pathname.substr(0, parts.pathname.length - 1)
  }

  return url.format(parts)
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
  React.render(
    <Provider redux={redux}>
      {() => <Handler />}
    </Provider>
    , document.body)

  let route = state.routes[state.routes.length-1]
  segment.track(ANALYTICS_ENGAGED, {
    type: 'page_view',
    path: state.path,
    routeName: route ? route.name : '404'
  })

  Dispatcher.dispatch({type: ROUTE_TRANSITIONED})
})
