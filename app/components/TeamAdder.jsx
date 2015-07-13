import Avatar from 'ui/Avatar.jsx'
import EMAIL_REGEX from '../lib/email_regex'
import Field from 'ui/Field.jsx'
import Icon from 'ui/Icon.jsx'
import MembershipActions from 'actions/MembershipActions'
import React from 'react'
import SessionStore from 'stores/session_store'
import UserPicker from 'components/user_picker.jsx'
import { getOffsetTop } from 'ui/Picker.jsx'
import { List, Range } from 'immutable'

export default class TeamAdder extends React.Component {
  static defaultProps = {
    memberships: List()
  }
  constructor(props) {
    super(props)
    this.state = {
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
    const { memberships } = this.props

    return (
      <div className="mb2">
        <div>
          {memberships.filter(m => m.is_core).map((m, i) => {
            return <div key={m.user.username}>
              {this.renderListItem(
                i + 1,
                (m.type === "membership" ? this.renderMember : this.renderEmail).bind(this),
                m)
              }
            </div>
          })}
        </div>
        {this.renderListItem(
          this.props.memberships.count() + 1,
          this.renderEntry.bind(this)
        )}
        {this.renderBlankEntries()}
      </div>
    )
  }

  renderMember(m) {
    return (
      <div className="flex flex-center visible-hover-wrapper">
        <div>
          <Avatar user={m.user} size={16 * 1.5} />
        </div>
        <div className="flex-auto px2">
          {m.user.username}
        </div>
        {this.renderDeleteLink(m)}
      </div>
    )
  }

  renderEmail(m) {
    return (
      <div className="flex flex-center visible-hover-wrapper">
        <div className="center" style={{width: '1.5rem'}}>
          <Icon icon="envelope" color="silver" />
        </div>
        <div className="flex-auto px2">
          {m.user.username}
          {' '}
          <span className="h5 gray italic">Invitation pending</span>
        </div>
        {this.renderDeleteLink(m)}
      </div>
    )
  }

  renderDeleteLink(m) {
    // Don't let people delete themselves
    if (m.user.username === SessionStore.user.username) {
      return
    }

    return (
      <div className="visible-hover">
        <a className="pointer red" onClick={this.handleRemoveClicked(m)}>
          <Icon icon="trash-o" />
        </a>
      </div>
    )
  }

  renderBlankEntries() {
    const count = this.props.memberships.count()
    const n = Math.max(0, 3 - (count + 1))
    return Range(0, n).map((i) => {
      return this.renderListItem(count + 2 + i, this.renderBlankEntry.bind(this))
    })
  }

  renderBlankEntry() {
    return (
      <div className="bg-smoke silver rounded px2 py1">
        Add more team members
      </div>
    )
  }

  renderListItem(i, fn, ...args) {
    if (!this.props.showNumbers) {
      return <div className="mb2">{fn(...args)}</div>
    }

    return (
      <div className="flex flex-center mb2">
        <div className="mr2" style={{lineHeight: '2.5rem'}}>{i}.</div>
        <div className="flex-auto">{fn(...args)}</div>
      </div>
    )
  }

  renderEntry() {
    return (
      <div className="relative">
        {this.renderUserPicker()}
        <Field type="text" ref="emailOrUsername"
          placeholder="Invite a team member with their email or username"
          onFocus={this.toggleFocus.bind(this)}
          onBlur={this.toggleFocus.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          value={this.state.emailOrUsername} />
        {this.renderStatus()}
      </div>
    )
  }

  toggleFocus() {
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

  handleAddMember() {
    MembershipActions.update(
      this.props.changelog.slug,
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
    return () => {
      MembershipActions.update(
        this.props.changelog.slug,
        membership.user.username, {
          can_view: false,
          can_write: false,
          is_core: false
        }
      )
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
  showBlankEntries: React.PropTypes.bool,
  showNumbers: React.PropTypes.bool,
}

TeamAdder.defaultProps = {
  showNumbers: false
}
