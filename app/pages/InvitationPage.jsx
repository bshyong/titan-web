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
    console.log(params)
    InvitationActions.fetchInvitation(params.invite_token)
    membershipInvite.set(params.invite_token)
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
              <div className="sm-col-9 mx-auto">
                <div className="h2 mt4 mb0" style={{lineHeight: '2em'}}>
                  { guest.username || (currentUser || {}).username || 'Hey'},<br />
                {invitor.username} invited you to help craft a behind-the-scenes narrative of {`${changelog.name}'s`} creation. <br /> {currentUser ? 'You can now write to this Changelog.' : null}
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
                <div >
                  <div className="h2 mb1" style={{lineHeight: '2em'}}>
                    { currentUser ? null : 'Go ahead and get started:' }
                  </div>
                  {this.renderCTA()}
                </div>
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
      Claim your invite
    </Button>
  }

}
