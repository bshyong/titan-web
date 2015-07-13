import EmailInvitePopup from '../components/EmailInvitePopup.jsx'
import MENTION_REGEX from '../lib/mention_regex'
import noop from '../lib/noop'
import onUserSelected from '../lib/onUserSelected'
import React from 'react'
import UserPicker from './UserPicker.jsx'
import UserPickerActions from '../actions/user_picker_actions'

export default class AutocompleteUserInput extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onFocus: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: false
    }

    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.onUserSelected = this._onUserSelected.bind(this)
  }

  render() {
    const {
      onChange,
      placeholder,
      value
    } = this.props

    return (
      <div className="relative">
        {this.renderPopup()}
        <input type="text"
          {...this.props}
          placeholder={placeholder}
          value={value}
          onBlur={this.handleBlur.bind(this)}
          onChange={onChange}
          onFocus={this.handleFocus.bind(this)}
          onKeyDown={this.handleKeyDown}
          ref="input" />
      </div>
    )
  }

  renderPopup() {
    if (!this.state.focused) {
      return
    }

    const value = this.props.value || ''
    const mention = MENTION_REGEX.exec(value.substr(0, this.selectionStart))
    const email = /[^ ]+@[^ +]/.exec(value.substr(0, this.selectionStart))

    if (mention) {
      return <UserPicker query={mention[2]}
          onUserSelected={this.onUserSelected}
          maxHeight={170} ref="userPickerPopup"/>
    } else if (email) {
      // return <EmailInvitePopup email={email[0]} />
    }
  }

  _handleKeyDown(e) {
    // Keep track of the cursor location (without triggering a render)
    // so that the user picker can match usernames in the middle of the
    // text
    this.props.onKeyDown(e)
    this.selectionStart = e.target.selectionStart + 1
  }

  _onUserSelected(user) {
    let callback = (match, space, username, offset, string) => {
      return `${space}@${user.username}, `
    }
    setTimeout(() => {
      onUserSelected.call(this, this.refs.input, user, callback)
    }, 0)
  }

  handleFocus(e) {
    this.setState({focused: true})
    this.props.onFocus && this.props.onFocus(e)
  }

  handleBlur(e) {
    // give the UserPicker time to select the user
    // before blurring and dismissing it
    setTimeout(() => {
      this.setState({focused: false})
      this.props.onBlur && this.props.onBlur(e)
    }, 200)
  }
}
