import {RouteHandler} from 'react-router'
import ApplicationNavbar from '../components/application_navbar.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import ErrorPage from '../pages/ErrorPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import React from 'react'
import RoutesStore from '../stores/routes_store'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

@connectToStores(RoutesStore)
export default class AppPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (query.a) {
      if (!SessionStore.isSignedIn()) {
        SessionActions.signin()
      }
    }
  }

  static getPropsFromStores(props) {
    return {
      apiError: RoutesStore.apiError,
      resourceFound: RoutesStore.resourceFound
    }
  }

  render() {
    if (this.props.apiError) {
      return <ErrorPage error={this.props.apiError} />
    }

    if (this.props.resourceFound === false) {
      return <NotFoundPage />
    }

    return <RouteHandler />
  }
}
