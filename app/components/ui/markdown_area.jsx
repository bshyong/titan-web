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

    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.onUploaded = this._onUploaded.bind(this)
    this.onUploading = this._onUploading.bind(this)
  }

  render() {
    const style = {
      ...this.props.style,
      resize: 'none'
    }

    return (
      <DropzoneContainer id={this.props.id}
        onUploaded={this.onUploaded}
        onUploading={this.onUploading}>
        <TextareaAutosize
          {...this.props}
          className="field-light border-silver mb0 block full-width"
          style={style}
          onKeyDown={this.props.onCmdEnter ? this.handleKeyDown : null} />
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
      let value = this.props.value
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
