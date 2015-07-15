import React from 'react'
import Admin from '../components/Admin.jsx'
import AdminActions from '../actions/admin_actions'
import AuthenticatedComponent from '../components/mixins/authenticated_mixin.jsx'
import RouterContainer from '../lib/router_container'
import AppNavbar from 'components/App/AppNavbar.jsx'
import SessionActions from '../actions/SessionActions'
import SessionStore from '../stores/session_store'

@AuthenticatedComponent()
export default class AdminPage extends React.Component {

  static willTransitionTo() {
    AdminActions.adminDataFetched()
    AdminActions.adminUserDataFetched()
    AdminActions.adminStoriesFetched()
    AdminActions.adminStatsFetched()
  }

  static get defaultProps() {
    return {
      user: SessionStore.user
    }
  }

  render() {
    if (this.props.user.staff_at!==null) {
      return (
        <div>
          <AppNavbar />
          <Admin/>
        </div>
      )
    } else {
      RouterContainer.get().transitionTo('/home')
    }
  }
}
