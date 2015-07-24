import React from 'react'
import Admin from 'components/Admin.jsx'
import AdminActions from 'actions/admin_actions'
import authenticated from 'components/mixins/authenticated_mixin.jsx'
import AppNavbar from 'components/App/AppNavbar.jsx'
import SessionStore from 'stores/session_store'

@authenticated()
export default class AdminPage extends React.Component {
  static willTransitionTo(transition) {
    if (SessionStore.user && SessionStore.user.staff_at) {
      AdminActions.adminDataFetched()
      AdminActions.adminUserDataFetched()
      AdminActions.adminStoriesFetched()
      AdminActions.adminStatsFetched()
    } else {
      transition.redirect('home')
    }
  }

  render() {
    return (
      <div>
        <AppNavbar />
        <Admin/>
      </div>
    )
  }
}
