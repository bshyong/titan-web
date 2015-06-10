import ChangelogStore from '../stores/changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ChangelogCreation from '../components/ChangelogCreation.jsx'
import ApplicationNavbar from '../components/application_navbar.jsx'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

export default class NewChangelogPage extends React.Component {

  render() {

    if (!SessionStore.isSignedIn()) {
      SessionActions.signin()
      return (<div/>)
    } else {
      return <div>
        <ApplicationNavbar />
        <ChangelogCreation />
      </div>
    }
  }
}
