import React from 'react'
import RouterContainer from '../lib/router_container'
import ApplicationNavbar from '../components/application_navbar.jsx'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

export default class GithubRepoSelectionPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    const user = SessionStore.user
    if (!user) { SessionActions.signin() }
  }

  render() {
    const user = SessionStore.user
    return <div>
      <ApplicationNavbar />
      { true ? this.renderAuthedState() : this.renderUnauthedState() }
    </div>
  }

  renderAuthedState() {

  }

  renderUnauthedState() {

  }
}
