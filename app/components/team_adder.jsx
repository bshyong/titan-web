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
import { getOffsetTop } from '../ui/Picker.jsx'
import EMAIL_REGEX from '../lib/email_regex'
import SessionStore from '../stores/session_store'

export default class TeamAdder extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      copied: false,
      emailOrUsername: ''
    }
    this.timeout = null
    this.emailOrUsername = null
  }

  componentDidMount() {
    this.fromTop = getOffsetTop(React.findDOMNode(this))
    this.emailOrUsername = React.findDOMNode(this.refs.emailOrUsername)
  }

  componentWillUpdate() {
    this.fromTop = getOffsetTop(React.findDOMNode(this))
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
        <div>
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
                  {this.renderDeleteLink(m)}
                </div>
              )
            }
          })}
        </div>
        {this.renderEntry()}
        {this.renderBlankEntries()}
      </div>
    )
  }

  renderDeleteLink(m) {
    if (m.user.username !== SessionStore.user.username) {
      return (
        <div className="visible-hover">
          <a className="pointer red" onClick={this.handleRemoveClicked(m)}>
            <Icon icon="trash-o" />
          </a>
        </div>
      )
    }
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
    const n = Math.max(0, 3 - (this.props.memberships.count() + 1))
    return Range(0, n).map(this.renderBlankEntry.bind(this))
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
      <div className="py2 relative">
        {this.renderUserPicker()}
        <form className="mb2 mt2 full-width flex">
          <input type="text" ref="emailOrUsername"
            className="field-light flex-auto"
            placeholder="Invite using their email or username"
            onFocus={this.toggleFocus.bind(this)}
            onBlur={this.toggleFocus.bind(this)}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            value={this.state.emailOrUsername} />
          {this.renderStatus()}
        </form>
      </div>
    )
  }

  toggleFocus(e) {
    this.setState({
      focused: !this.state.focused
    })
  }

  handleChange() {
    this.setState({
      emailOrUsername: this.emailOrUsername.value
    })
  }

  handleKeyDown(e) {
    if (e.keyCode === 13 && !React.findDOMNode(this.refs.userPicker)) {
      e.preventDefault()
      if (EMAIL_REGEX.test(this.state.emailOrUsername)) {
        this.handleAddMember(e)
      }
    }
  }

  renderUserPicker() {
    if (!this.state.focused) {
      return
    }

    const value = (this.state.emailOrUsername || '').replace(/^@+/, '')

    if (value) {
      return <UserPicker query={value}
        onUserSelected={this.onUserSelected.bind(this)}
        maxHeight={Math.min((this.fromTop === 0 ? 170 : this.fromTop), 170)}
        offset={30}
        ref="userPicker" />
    }

  }

  handleAddMember(e) {
    MembershipActions.update(
      this.props.changelogId,
      this.state.emailOrUsername, {
        can_write: true,
        can_view: true,
        is_core: true
      }
    )
    this.setState({
      emailOrUsername: ''
    })
  }

  onUserSelected(u) {
    this.setState({ emailOrUsername: u.username },
      this.handleAddMember
    )
  }

  handleRemoveClicked(membership) {
    return (e) => {
      if (confirm(`Are you sure you want to remove @${membership.user.username}?`)) {
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
