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
    let handler = <RouteHandler />
    if (this.props.apiError) {
      handler = <ErrorPage error={this.props.apiError} />
    } else if (this.props.resourceFound === false) {
      handler = <NotFoundPage />
    }

    return <div>
      <ApplicationNavbar />
      {handler}
    </div>
  }
}
