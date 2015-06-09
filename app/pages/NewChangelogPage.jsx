import ChangelogStore from '../stores/changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ChangelogCreation from '../components/ChangelogCreation.jsx'
import ApplicationNavbar from '../components/application_navbar.jsx'

export default class NewChangelogPage extends React.Component {

  render() {
    return <div>
      <ApplicationNavbar />
      <ChangelogCreation />
    </div>
  }
}
