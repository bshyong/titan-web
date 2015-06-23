import Avatar from '../ui/Avatar.jsx'
import Badge from './Badge.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import Icon from '../ui/Icon.jsx'
import MembershipActions from '../actions/MembershipActions'
import NewChangelogActions from '../actions/new_changelog_actions'
import NewChangelogStore from '../stores/new_changelog_store'
import PostSetActions from '../actions/PostSetActions'
import React from 'react'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'
import UserPicker from '../components/user_picker.jsx'
import UserPickerActions from '../actions/user_picker_actions'
import connectToStores from '../lib/connectToStores.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import { Link } from 'react-router'
import { Range } from 'immutable'
import InvitationActions from '../actions/invitation_actions'
import Clipboard from 'react-zeroclipboard'

export default class TeamAdder extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      entryCount: 0,
      copied: false
    }
    this.timeout = null
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { memberships, changelog } = this.props

    return (
      <div className="mb2">
        <div>
	        <p className="gray h5">
            Anyone you add here will be members of your Changelog. They will be able to read, write, and comment on all posts.
	        </p>
        </div>
        { this.renderInviteLink() }
        {memberships.map(m => {
          if (m.is_core) {
            return (
              <div className="flex flex-center py2 bg-smoke-hover visible-hover-wrapper" key={m.id}>
                <div>
                  <Avatar user={m.user} size={16 * 2} />
                </div>
                <div className="flex-auto px2">
                  {m.user.username}
                </div>
                <div className="visible-hover">
                  <a className="pointer red" onClick={this.handleRemoveClicked(m)}>
                    <Icon icon="trash-o" />
                  </a>
                </div>
              </div>
            )
          }
        })}
        {this.renderEntry()}
        {this.renderBlankEntries()}
      </div>
    )
  }

  renderInviteLink() {
    const { changelog } = this.props
    const { copied } = this.state

    return (
      <div className="h5 mb3">
        <div>
          Send this private link to anyone you want to invite.
          <span className="gray ml1 pointer" onClick={this.handleLinkReset.bind(this)}>Reset link</span>
        </div>
        <div className="flex flex-center border border-silver">
          <div className="flex-auto">
            <input
              className="border-none full-width px1"
              style={{outline: 'none'}}
              value={this.inviteLinkAsURL()}
              onClick={e => e.target.select()}
              ref="inviteLink"
             />
          </div>
          <Clipboard
            text={this.inviteLinkAsURL()}
            onAfterCopy={this.handleAfterCopy.bind(this)}>
             <div className="pointer flex-none p1 border-left border-silver center bg-whitesmoke orange">
               {copied ? 'Copied' : 'Copy'}
             </div>
          </Clipboard>
        </div>
      </div>
    )
  }

  handleAfterCopy() {
    this.setState({copied: true}, () => {
      this.timeout = setTimeout(() => {
        this.setState({copied: false})
      }, 1000)
    })
  }

  inviteLinkAsURL() {
    const { changelog } = this.props
    return `${MAIN_HOST}/invitations/${changelog.invite_hash}`
  }

  handleLinkReset() {
    const { changelog } = this.props
    if(confirm('This will invalidate the current link and create a new one')) {
      InvitationActions.resetInvitation(changelog.slug, changelog.invite_hash)
    }
  }

  renderBlankEntries() {
    let n = this.state.entryCount + 1
    let m = 3 - n
    if (n > 3 ) {
      m = 0
    }
    if (this.props.showBlankEntries) {
      return Range(0, m).map(this.renderBlankEntry.bind(this))
    }
  }

  renderBlankEntry() {
    return (
      <div className="py1">
        <form className="mb2">
          <input type="text"
                disabled={true}
                 className="field-light full-width"
                 placeholder="Add more team members" />
        </form>
      </div>
    )
  }

  renderEntry() {
    return (
      <div className="py2">
        <form onSubmit={this.handleAddMember.bind(this)} className="mb2 mt2 full-width flex">
          <input type="text" ref={"emailOrUsername"}
                 className="field-light flex-auto"
                 placeholder="Invite using their email or username" />
          {this.renderStatus()}
        </form>
      </div>
    )
  }

  handleAddMember(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.emailOrUsername)
    let text = el.value
    if (text !== "") {
      MembershipActions.update(
        this.props.changelogId,
        text, {
          can_write: true,
          can_view: true,
          is_core: true
        }
      )
      let c = this.state.entryCount + 1
      this.setState({entryCount: NewChangelogStore.memberships.size })
      el.value = ''
    }
  }

  handleRemoveClicked(membership) {
    return (e) => {
      if (confirm(`Are you sure you want to remove @${membership.user.username}?`)) {
        let c = this.state.entryCount - 1
        this.setState({entryCount: c})
        MembershipActions.update(
          this.props.changelogId,
          membership.user.username, {
            can_view: false,
            can_write: false,
            is_core: false
          }
        )
      }
    }
  }

  renderStatus() {
    if (this.props.updateSuccessful) {
      return <span className="ml1 green">Update successful</span>
    }
    if (this.props.updateSuccessful === false) {
      if (this.props.errors.user && this.props.errors.user.join().indexOf('blank') !== -1) {
        return <span className="ml1 red">Unknown user</span>
      }
      return <span className="ml1 red">Update failed</span>
    }
    return null
  }
}

TeamAdder.propTypes = {
  memberships: React.PropTypes.object,
  changelogId: React.PropTypes.string,
  changelog: React.PropTypes.object,
  showBlankEntries: React.PropTypes.bool
}
