import ApplicationNavbar from '../components/application_navbar.jsx'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import DocumentTitle from 'react-document-title'

export default class InvitationPage extends React.Component {
  static willTransitionTo(transition, params, query) {

  }

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <ApplicationNavbar title={`You're invited to TKS Changelog`} />
          <DocumentTitle title="Invitation">
            <div>

            </div>
          </DocumentTitle>
      </div>
    )
  }
}
