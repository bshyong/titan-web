import AppNavbar from 'components/App/AppNavbar.jsx'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import DocumentTitle from 'react-document-title'
import fetchData from 'decorators/fetchData'
import Link from '../components/Link.jsx'
import membershipInvite from '../lib/membershipInvite'
import React from 'react'
import SessionStore from '../stores/session_store'
import * as signinScrimActions from 'actions/signinScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'

@connectToStores(SessionStore)
export class InvitationPage extends React.Component {
  static getPropsFromStores() {
    return {
      currentUser: SessionStore.user,
    }
  }

  render() {
    const { currentUser, invitation } = this.props

    if (!invitation) { return <div /> }

    const { changelog } = invitation
    const invitor = invitation.invitor || invitor.changelog.user
    const guest = invitation.guest || {}

    return (
      <DocumentTitle title={`Invitation to ${changelog.name} Changelog`}>
        <div>
          <AppNavbar title={`You're invited to ${changelog.name}'s Changelog`} />

          <div className="container p3">
            <div className="sm-col-9 mx-auto">
              <div className="h2 mt4 mb0" style={{lineHeight: '2em'}}>
                Hi { guest.username || (currentUser || {}).username || ''}<br /><br />
                {invitor.username} invited you to be a member of the {`${changelog.name}'s`} Changelog. {currentUser ? 'You can now read, write, and invite others to this Changelog.' : null} Use it to stay date with everyone's progress, get feedback from others on your work,
                and even let you share product updates with a larger community. How exciting!<br />
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
                <div className="h2 mb1" style={{lineHeight: '2em'}}>
                  { currentUser ? null : 'Go ahead and get started:' }
                </div>
                {this.renderCTA()}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

  renderCTA() {
    const { currentUser, invitation: { changelog } } = this.props

    if (currentUser) {
      return <Link to="changelog" params={{changelogId: changelog.slug}}>
        <Button color="white" bg="orange" size="big">
          Go to {`${changelog.name}`}
        </Button>
      </Link>
    }
    return <Button color="white" bg="orange" size="big" action={() => this.props.show(SignupForm, window.location.pathname)}>
      Claim your invite
    </Button>
  }
}

import {connect} from 'redux/react'
import {bindActionCreators} from 'redux'
import * as invitationActions from 'actions/invitationActions'

@fetchData(params => {
  membershipInvite.set(params.invite_token)
  return invitationActions.fetchInvitation(params.invite_token)
})
@connect(state => {
  return ({
  invitation: state.invitation,
})})
export default class InvitationPageWrapper extends React.Component {
  render() {
    if (!this.props.invitation) {
      return <div />
    }
    return <InvitationPage {...this.props} invitation={this.props.invitation.invitation}
                           {...bindActionCreators(invitationActions, this.props.dispatch)}
                           {...bindActionCreators(signinScrimActions, this.props.dispatch)} />
  }
}
