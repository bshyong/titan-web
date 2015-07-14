import {connect} from 'redux/react'
import {fetchFollowing, fetchMembered} from 'actions/changelogActions'
import {RouteHandler} from 'react-router'
import connectToStores from 'lib/connectToStores.jsx'
import ErrorPage from 'pages/ErrorPage.jsx'
import Footer from 'components/Footer.jsx'
import NotFoundPage from 'pages/NotFoundPage.jsx'
import React from 'react'
import RoutesStore from 'stores/routes_store'
import SessionActions from 'actions/SessionActions'
import SessionStore from 'stores/session_store'
import SigninScrim from 'components/Authentication/SigninScrim.jsx'

@connect(state => ({}))
@connectToStores(RoutesStore)
export default class AppPage extends React.Component {
  static getPropsFromStores(props) {
    return {
      apiError: RoutesStore.apiError,
      resourceFound: RoutesStore.resourceFound
    }
  }

  componentWillMount() {
    if (SessionStore.user) {
      this.props.dispatch(fetchFollowing(SessionStore.user.username))
      this.props.dispatch(fetchMembered(SessionStore.user.username))
    }
  }

  render() {
    if (this.props.apiError) {
      return <ErrorPage error={this.props.apiError} />
    }

    if (this.props.resourceFound === false) {
      return <NotFoundPage />
    }

    return (
      <div>
        <SigninScrim />
        <div style={{minHeight: 800}}>
          <RouteHandler />
        </div>
        <Footer />
      </div>
    )
  }
}
