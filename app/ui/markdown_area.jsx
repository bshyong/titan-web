import DropzoneContainer from '../components/DropzoneContainer.jsx'
import GifPicker from '../components/gif_picker.jsx'
import GifPickerTrigger from '../images/magic-icon.svg'
import MENTION_REGEX from '../lib/mention_regex'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import UploadSrc from '../images/image-upload-icon.svg'
import UserPicker from '../components/user_picker.jsx'
import UserPickerActions from '../actions/user_picker_actions'
import classnames from 'classnames'
import getCaretCoordinates from 'textarea-caret-position'
import noop from '../lib/noop'
import onMobile from '../lib/on_mobile'
import onUserSelected from '../lib/onUserSelected'
import { getOffsetTop } from './Picker.jsx'
import { List } from 'immutable'
import Sticky from 'ui/Sticky.jsx'

export default class MarkdownArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }

    this.handleChange = this._handleChange.bind(this)
    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.onUploaded = this._onUploaded.bind(this)
    this.onUploading = this._onUploading.bind(this)
    this.onUserSelected = this._onUserSelected.bind(this)
    this.onGifSelected = this._onGifSelected.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
    this.updateSelectionStart = this._updateSelectionStart.bind(this)
  }

  componentDidMount() {
    const offsetTop = getOffsetTop(React.findDOMNode(this))
    this.fromTop = getOffsetTop(React.findDOMNode(this))
    this.dropzoneClickable = React.findDOMNode(this.refs.clickable)
  }

  componentWillUpdate() {
    const offsetTop = getOffsetTop(React.findDOMNode(this))
    this.fromTop = getOffsetTop(React.findDOMNode(this))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value &&
        MENTION_REGEX.exec(nextProps.value.substr(0, this.selectionStart))) {
      this.closeGifPicker()
    }
  }

  render() {
    const { border } = this.props

    let style = {
      div: {
        ...this.props.style,
        backgroundColor: 'white',
      },
      textarea: {
        ...this.props.style,
        resize: 'none',
        outline: 'none',
        border: 'none',
        borderRadius: 3,
      },
    }

    if (border && this.state.focused) {
      style.div.borderColor = '#00A3B9'
      style.div.boxShadow = '0 0 2px #00A3B9'
      style.div.outline = 'none'
    }

    const classes = classnames(
      'mb0 py0 full-width relative flex', {
      'field-light border-silver': border,
    })

    return (
      <div>
        {onMobile() ? this.renderGifPicker() : null}
        <DropzoneContainer id={this.props.id}
          onUploaded={this.onUploaded}
          onUploading={this.onUploading}
          clickable={this.dropzoneClickable}>
          {onMobile() ? null : this.renderGifPicker()}
          {this.renderUserPicker()}
          <div className={classes}
              style={style.div}>
              <div className="flex-auto">
                <TextareaAutosize
                  {...this.props}
                  ref="textarea"
                  className="block full-width"
                  style={style.textarea}
                  onBlur={this.toggleFocus}
                  onChange={this.handleChange}
                  onClick={this.updateSelectionStart}
                  onFocus={this.toggleFocus}
                  onKeyDown={this.props.onCmdEnter ? this.handleKeyDown : this.updateSelectionStart} />
              </div>
              <div className="flex-none">
                <Sticky>
                  <div className="flex ml1">
                    <div className="py1 mr1 pointer gray" onClick={this.toggleGifPicker.bind(this)}>
                      <img className="block" src={GifPickerTrigger} style={{height: '1.5rem'}} />
                    </div>
                    <div className="py1 mr1 pointer gray" ref="clickable" onClick={this.closeGifPicker.bind(this)}>
                      <img className="block" src={UploadSrc} style={{height: '1.5rem'}} />
                    </div>
                  </div>
                </Sticky>
              </div>
          </div>
        </DropzoneContainer>
      </div>
    )
  }

  closeGifPicker() {
    this.setState({
      gifPickerOpen: false,
    })
  }

  toggleGifPicker(state) {
    this.setState({
      gifPickerOpen: !this.state.gifPickerOpen
    })
  }

  renderGifPicker() {
    if (this.state.gifPickerOpen) {
      return (
        <GifPicker
          position={this.props.gifPickerPosition}
          onGifSelect={this.onGifSelected.bind(this)}
          onPickerCancel={this.toggleGifPicker.bind(this)} />
      )
    }
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
          maxHeight={Math.min((this.fromTop === 0 ? 170 : this.fromTop), 170)}
          offset={this.offset} />
    }
  }

  _handleChange(e) {
    this.offset = getCaretCoordinates(e.target, e.target.selectionEnd).top
    this.props.onChange && this.props.onChange(e)
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
      const value = this.props.value || ''
      const beginning = value.substr(0, this.selectionStart).trim()

      const attachmentText = attachments.
        map(a => `![Uploading ${a.name}...]()`).join('\n')

      let end = value.substr(this.selectionStart)
      if (end === beginning) {
        end = ''
      }

      const start = this.selectionStart = [beginning, attachmentText].join(' ').length

      const simulatedEvent = {
        target: {
          value: [beginning, attachmentText, end].join(' ')
        }
      }

      this.props.onChange(simulatedEvent)

      React.findDOMNode(this.refs.textarea).setSelectionRange(start, start)

    }, 0)
  }

  _onGifSelected(gif, alt) {
    setTimeout(() => {
      const value = this.props.value || ''
      const beginning = value.substr(0, this.selectionStart).trim()
      const newBeginning = `${beginning} ![${alt || 'gif'}](${gif.url})`

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

      this.toggleGifPicker()
    }, 0)
  }

  _onUserSelected(user) {
    setTimeout(() => {
      onUserSelected.call(this, this.refs.textarea, user)
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
