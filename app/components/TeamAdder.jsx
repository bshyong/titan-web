import Avatar from 'ui/Avatar.jsx'
import EMAIL_REGEX from '../lib/email_regex'
import Field from 'ui/Field.jsx'
import Icon from 'ui/Icon.jsx'
import * as membershipActions from 'actions/membershipActions'
import React from 'react'
import SessionStore from 'stores/session_store'
import UserPicker from 'components/UserPicker.jsx'
import { getOffsetTop } from 'ui/Picker.jsx'
import { List, Range } from 'immutable'

export class TeamAdder extends React.Component {
  static propTypes = {
    memberships: React.PropTypes.object,
    changelogId: React.PropTypes.string,
    changelog: React.PropTypes.object,
    showBlankEntries: React.PropTypes.bool,
    showNumbers: React.PropTypes.bool,
  }

  static defaultProps = {
    memberships: List(),
    showNumbers: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      emailOrUsername: '',
    }
    this.timeout = null
  }

  componentDidMount() {
    this.fromTop = getOffsetTop(React.findDOMNode(this))
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
          {memberships.map((m, i) => {
            return (
              <div key={m.user.username}>
                {this.renderListItem(
                  i + 1,
                  (m.type === "membership" ? this.renderMember : this.renderEmail).bind(this),
                  m
                )}
              </div>
            )
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

  // Don't let people delete themselves
  renderDeleteLink(m) {
    if (m.user.username === SessionStore.user.username) {
      return <div />
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
    
  }

  renderListItem(i, fn, ...args) {
    if (!this.props.showNumbers) {
      return <div className="mb2" key={i}>{fn(...args)}</div>
    }

    return (
      <div className="flex flex-center mb2" key={`team-adder-item-${i}`}>
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
      focused: !this.state.focused,
    })
  }

  handleChange() {
    this.setState({
      emailOrUsername: this.refs.emailOrUsername.value,
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
    const value = (this.state.emailOrUsername || '').replace(/^@+/, '')

    if (value) {
      return <UserPicker query={value}
        onUserSelected={this.onUserSelected.bind(this)}
        maxHeight={Math.min((this.fromTop === 0 ? 170 : this.fromTop), 170)}
        shown={this.state.focused}
        ref="userPicker" />
    }
  }

  handleAddMember() {
    this.props.updateMembership(
      this.props.changelog.slug,
      this.state.emailOrUsername, {
        can_write: true,
        can_view: true,
        is_core: true,
      }
    )
    this.setState({
      emailOrUsername: '',
    })
  }

  onUserSelected(u) {
    this.setState({ emailOrUsername: u.username },
      this.handleAddMember
    )
  }

  handleRemoveClicked(membership) {
    return () => {
      this.props.deleteMembership(
        this.props.changelog.slug,
        membership.user.username,
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

import {connect} from 'redux/react'
import {bindActionCreators} from 'redux'

@connect(() => ({}))
export default class Wrapper extends React.Component {
  render() {
    return <TeamAdder {...this.props}
                      {...bindActionCreators(membershipActions, this.props.dispatch)} />
  }
}
