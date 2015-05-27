import MENTION_REGEX from '../lib/mention_regex'
import noop from '../lib/noop'
import React from 'react'
import UserPicker from './user_picker.jsx'
import UserPickerActions from '../actions/user_picker_actions'

export default class AutocompleteUserInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }

    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.onUserSelected = this._onUserSelected.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
  }

  render() {
    const {
      className,
      onChange,
      placeholder,
      value
    } = this.props

    return (
      <div className="relative">
        {this.renderUserPicker()}
        <input type="text"
          {...this.props}
          className={className}
          placeholder={placeholder}
          value={value}
          onBlur={this.toggleFocus}
          onChange={onChange}
          onFocus={this.toggleFocus}
          onKeyDown={this.handleKeyDown}
          ref="input" />
      </div>
    )
  }

  renderUserPicker() {
    if (!this.state.focused) {
      return
    }

    const value = this.props.value || ''
    const match = MENTION_REGEX.exec(value.substr(0, this.selectionStart))

    if (match) {
      return <UserPicker query={match[2]}
          onUserSelected={this.onUserSelected}
          position="bottom"
          maxHeight={170} />
    }
  }

  _handleKeyDown(e) {
    // Keep track of the cursor location (without triggering a render)
    // so that the user picker can match usernames in the middle of the
    // text
    this.selectionStart = e.target.selectionStart + 1
  }

  _onUserSelected(user) {
    setTimeout(() => {
      const value = this.props.value
      const beginning = (value || '').substr(0, this.selectionStart).trim()
      const newBeginning = beginning.replace(
        MENTION_REGEX,
        (match, space, username, offset, string) => {
          return `${space}@${user.username}, `
        }
      )

      let end = value.substr(this.selectionStart)

      if (end === beginning) {
        end = ''
      }

      const simulatedEvent = {
        target: {
          value: newBeginning + end
        }
      }

      const start = this.selectionStart = newBeginning.length

      this.props.onChange(simulatedEvent)

      // Put the cursor where the user expects it to be,
      // not necessarily at the end of the input
      React.findDOMNode(this.refs.input).
        setSelectionRange(start, start)
    }, 0)
  }

  _toggleFocus() {
    this.setState({
      focused: !this.state.focused
    })
  }
}

AutocompleteUserInput.defaultProps = {
  className: "full-width block mb0 border-none outline-none"
}

AutocompleteUserInput.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
}
