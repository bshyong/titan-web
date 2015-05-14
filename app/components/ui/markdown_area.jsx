import DropzoneContainer from 'components/dropzone_container.jsx'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {List} from 'immutable'

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
        // FIXME: (pletcher) There must be a better
        // way to get the textarea to take up the full
        // height of its parent
        marginBottom: -7,
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
