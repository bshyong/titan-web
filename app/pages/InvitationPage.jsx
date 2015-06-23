import ApplicationNavbar from '../components/application_navbar.jsx'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import DocumentTitle from 'react-document-title'
import InvitationActions from '../actions/invitation_actions'
import InvitationStore from '../stores/invitation_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import connectToStores from '../lib/connectToStores.jsx'
import Link from '../components/Link.jsx'
import membershipInvite from '../lib/membershipInvite'

@connectToStores(SessionStore, InvitationStore)
export default class InvitationPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    InvitationActions.fetchInvitation(params.inviteToken)
    membershipInvite.set(params.inviteToken)
  }

  static getPropsFromStores() {
    return {
      currentUser: SessionStore.user,
      invitation: InvitationStore.invitation,
    }
  }

  render() {
    const { currentUser, invitation } = this.props

    if (!invitation) { return <div /> }

    const { changelog } = invitation
    const invitor = invitation.invitor || invitor.changelog.user
    const guest = invitation.guest || {}

    return (
      <div>
        <ApplicationNavbar title={`You're invited to ${changelog.name}'s Changelog`} />
          <DocumentTitle title={`Invitation to ${changelog.name} Changelog`}>
            <div className="container p3">
              <div className="sm-col-9 h2 mt4 mb2" style={{lineHeight: '2em'}}>
                { guest.username || (currentUser || {}).username || 'Hey'},<br />
                You've been invited to join Assembly's Changelog to build a behind-the-scene's making of your product.
              </div>
              <div className="mt2 mb3">
                <div className="flex flex-center">
                  <div>
                    <Avatar user={invitor} size={16 * 2} />
                  </div>
                  <div className="flex-auto px2">
                    {invitor.username}
                  </div>
                </div>
              </div>
              <div>
                {this.renderCTA()}
              </div>
            </div>
          </DocumentTitle>
      </div>
    )
  }

  renderCTA() {
    const { currentUser, invitation: { changelog } } = this.props

    if (currentUser) {
      return <Link to="changelog" params={{changelogId: changelog.slug}}>
        <Button color="white" bg="orange" size="big">
          Go to {`${changelog.name}'s`} Changelog
        </Button>
      </Link>
    }
    return <Button color="white" bg="orange" size="big" action={SessionActions.signin}>
      Sign in or create an account
    </Button>
  }

}
