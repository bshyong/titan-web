import React from 'react'
import Admin from '../components/admin.jsx'
import AdminActions from '../actions/admin_actions'
import AuthenticatedComponent from '../components/mixins/authenticated_mixin.jsx'
import RouterContainer from '../lib/router_container'
import ApplicationNavbar from '../components/application_navbar.jsx'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

@AuthenticatedComponent()
export default class AdminPage extends React.Component {

  static willTransitionTo() {
    AdminActions.AdminDataFetched()
  }

  static get defaultProps() {
    return {
      user: SessionStore.user
    }
  }

  render() {
    if (this.props.user.staff_at!=null) {
      return (
        <Admin/>
      )
    } else {
      RouterContainer.get().transitionTo('/home')
    }
  }
}
