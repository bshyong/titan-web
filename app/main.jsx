require('babel/polyfill')

import './images/favicon.ico'
import './stylesheets/application.css'
import 'isomorphic-fetch'
import api from 'lib/api'
import c from 'constants'
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
  const parts = url.parse(window.location.href)
  const to = `${parts.protocol}\/\/assembly.com${parts.path}`

  window.location.href = to
}


// redux
import createRedux from 'redux/create'
import { Provider } from 'redux/react'

const initialState = {}
const jwt = localStorage.getItem('jwt')
if (jwt) {
  const user = SessionActions.signinFromToken(jwt)
  initialState.currentUser = user
}
const redux = createRedux(api, initialState)

// Monkey patch to make domains and hashes in urls work
Router.HistoryLocation.getCurrentPath = function getCurrentPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let hash = window.location.href.split('#')[1] || ''
  if (hash) {
    hash = "#" + hash
  }

  const windowPath = decodeURI(
    window.location.pathname + window.location.search + hash
  )

  const parts = url.parse(windowPath)
  if (parts.pathname.length > 1 && parts.pathname.substr(-1) === '/') {
    parts.pathname = parts.pathname.substr(0, parts.pathname.length - 1)
  }

  return url.format(parts)
}

RouterContainer.setRouters({
  internal: Router.create({
    routes: Routes.internal,
    location: Router.HistoryLocation,
  }),

  external: Router.create({
    routes: Routes.external,
    location: Router.HistoryLocation,
  }),
})

RouterContainer.setDomain(window.location.hostname)

RouterContainer.router.run((Handler, state) => {
  redux.dispatch({type: c.ROUTE_TRANSITIONING, state: state})
  const fetchs = state.routes.map(r => r.handler).filter(h => h.fetchData).map(h => h.fetchData)
  const reduxState = redux.getState()
  const dispatches = fetchs.map(f => f(state.params, state.query, reduxState))
  dispatches.filter(d => !!d).map(d => {
    if (d.map) {
      return d.map(redux.dispatch)
    }
    return redux.dispatch(d)
  })

  React.render(
    <Provider redux={redux}>
      {() => <Handler />}
    </Provider>
    , document.body)

  const route = state.routes[state.routes.length - 1]
  segment.track(c.ANALYTICS_ENGAGED, {
    type: 'page_view',
    path: state.path,
    routeName: route ? route.name : '404',
  })

  Dispatcher.dispatch({type: c.ROUTE_TRANSITIONED})
  redux.dispatch({type: c.ROUTE_TRANSITIONED, state: state})
})
