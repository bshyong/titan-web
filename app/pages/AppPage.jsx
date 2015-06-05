import ApplicationNavbar from '../components/application_navbar.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import ErrorPage from '../pages/ErrorPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import React from 'react'
import RoutesStore from '../stores/routes_store'
import {RouteHandler} from 'react-router'

@connectToStores(RoutesStore)
export default class AppPage extends React.Component {
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

    return <div>
      <ApplicationNavbar />
      <RouteHandler />
    </div>
  }
}
