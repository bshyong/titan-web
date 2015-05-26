import classnames from 'classnames'
import debounce from '../lib/debounce'
import DropzoneContainer from '../components/dropzone_container.jsx'
import { getOffsetTop } from './picker.jsx'
import MENTION_REGEX from '../../lib/mention_regex'
import noop from '../../lib/noop'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import UserPicker from '../components/user_picker.jsx'
import UserPickerActions from '../actions/user_picker_actions'
import {List} from 'immutable'

export default class MarkdownArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }

    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.onUploaded = this._onUploaded.bind(this)
    this.onUploading = this._onUploading.bind(this)
    this.onUserSelected = this._onUserSelected.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
    this.updateSelectionStart = this._updateSelectionStart.bind(this)
  }

  componentDidMount() {
    this.height = getOffsetTop(React.findDOMNode(this)) - 55
  }

  render() {
    const { border } = this.props

    let style = {
      div: {
        ...this.props.style,
        backgroundColor: 'white'
      },
      textarea: {
        ...this.props.style,
        width: '91%',
        resize: 'none',
        outline: 'none',
        border: 'none',
        borderRadius: 3
      }
    }

    if (border && this.state.focused) {
      style.div.borderColor = '#00A3B9'
      style.div.boxShadow = '0 0 2px #00A3B9'
      style.div.outline = 'none'
    }

    const classes = classnames("mb0 py0 full-width relative", {
      "field-light border-silver": border
    })

    return (
      <DropzoneContainer id={this.props.id}
        onUploaded={this.onUploaded}
        onUploading={this.onUploading}>
        {this.renderUserPicker()}
        <div className={classes} style={style.div}>
          <TextareaAutosize
            {...this.props}
            ref="textarea"
            style={style.textarea}
            onBlur={this.toggleFocus}
            onFocus={this.toggleFocus}
            onKeyDown={this.props.onCmdEnter ? this.handleKeyDown : this.updateSelectionStart} />
        </div>
      </DropzoneContainer>
    )
  }

  renderUserPicker() {
    const value = this.props.value || ''
    const match = MENTION_REGEX.exec(value.substr(0, this.selectionStart))

    if (match) {
      return <UserPicker query={match[2]}
          onUserSelected={this.onUserSelected}
          maxHeight={Math.min(this.height, 170)} />
    }
  }

  _handleKeyDown(e) {
    this.updateSelectionStart(e)

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
      const value = this.props.value
      const beginning = (value || '').substr(0, this.selectionStart).trim()
      const newBeginning = beginning.replace(
        MENTION_REGEX,
        (match, space, username, offset, string) => {
          return `${space}@${user.username} `
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
      React.findDOMNode(this.refs.textarea).
        setSelectionRange(start, start)
    }, 0)
  }

  _toggleFocus(e) {
    this.setState({
      focused: !this.state.focused
    })
  }

  _updateSelectionStart(e) {
    // Keep track of the cursor location (without triggering a render)
    // so that the user picker can match usernames in the middle of the
    // text
    this.selectionStart = e.target.selectionStart + 1
  }
}

MarkdownArea.defaultProps = {
  border: true,
  id: 'new_comment',
  onChange: noop('No `onChange` handler was provided to MarkdownArea'),
}

MarkdownArea.propTypes = {
  border: React.PropTypes.bool,
  id: React.PropTypes.string,
  onCmdEnter: React.PropTypes.func,
  onChange: React.PropTypes.func,
  style: React.PropTypes.object
}
