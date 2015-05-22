import DropzoneContainer from '../dropzone_container.jsx'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import UserPicker from './user_picker.jsx'
import UserPickerActions from '../../actions/user_picker_actions'
import {List} from 'immutable'

const MENTION_REGEX = /(^|\s)@(\w+)$/

const noop = (msg) => {
  return () => {
    if (__DEV__) {
      console.warn(msg)
    }
  }
}

export default class MarkdownArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = { focused: false }

    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.onUploaded = this._onUploaded.bind(this)
    this.onUploading = this._onUploading.bind(this)
    this.onUserSelected = this._onUserSelected.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
  }

  render() {
    let style = {
      div: {
        ...this.props.style,
        backgroundColor: 'white'
      },
      textarea: {
        width: '91%',
        resize: 'none',
        outline: 'none',
        border: 'none',
        borderRadius: 3
      }
    }

    if (this.state.focused) {
      style.div.borderColor = '#00A3B9'
      style.div.boxShadow = '0 0 2px #00A3B9'
      style.div.outline = 'none'
    }

    return (
      <DropzoneContainer id={this.props.id}
        onUploaded={this.onUploaded}
        onUploading={this.onUploading}>
        {this.renderUserPicker()}
        <div className="field-light border-silver mb0 py0 full-width relative"
            style={style.div}>
          <TextareaAutosize
            {...this.props}
            style={style.textarea}
            onBlur={this.toggleFocus}
            onFocus={this.toggleFocus}
            onKeyDown={this.props.onCmdEnter ? this.handleKeyDown : null} />
        </div>
      </DropzoneContainer>
    )
  }

  renderUserPicker() {
    const match = (this.props.value || '').match(MENTION_REGEX)
    if (match) {
      UserPickerActions.fetchUsers(match[2])
      return <UserPicker onUserSelected={this.onUserSelected} />
    }
  }

  _handleKeyDown(e) {
    if (e.metaKey && e.keyCode == 13) {
      this.props.onCmdEnter()
    }
  }

  _onUploaded(attachment) {
    setTimeout(() => {
      let value = this.props.value || ''
      let text = value.replace(
        `![Uploading ${attachment.name}...]()`,
        `![${attachment.name}](${attachment.firesize_url}/${attachment.href})\n`
      )
      let simulatedEvent = {
        target: {
          value: text
        }
      }

      this.props.onChange(simulatedEvent)
    }, 0)
  }

  _onUploading(attachments) {
    setTimeout(() => {
      let value = this.props.value || ''
      let attachmentText = attachments.map(a => `![Uploading ${a.name}...]()`).join(' ')
      let simulatedEvent = {
        target: {
          value: value + attachmentText
        }
      }

      this.props.onChange(simulatedEvent)
    }, 0)
  }

  _onUserSelected(user) {
    setTimeout(() => {
      let value = this.props.value || ''

      let simulatedEvent = {
        target: {
          value: value.replace(
            MENTION_REGEX,
            (match, space, username, offset, string) => {
              return `${space}@${user.username} `
            }
          )
        }
      }

      this.props.onChange(simulatedEvent)
    }, 0)
  }

  _toggleFocus(e) {
    this.setState({
      focused: !this.state.focused
    })
  }
}

MarkdownArea.defaultProps = {
  id: 'new_comment',
  onChange: noop('No `onChange` handler was provided to MarkdownArea'),
}

MarkdownArea.propTypes = {
  id: React.PropTypes.string,
  onCmdEnter: React.PropTypes.func,
  onChange: React.PropTypes.func,
  style: React.PropTypes.object
}
