import { connect } from 'redux/react'
import * as AttachmentActions from 'actions/AttachmentActions'
import api from 'lib/api'
import Dropzone from 'config/dropzone'
import React, { Component, PropTypes } from 'react'
import statics from 'lib/statics'

@connect(state => ({
  attachments: state.attachments,
}))
export default class DropzoneContainer extends Component {
  static propTypes = {
    clickable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
      PropTypes.string,
    ]),
    onError: PropTypes.func.isRequired,
    onUploaded: PropTypes.func.isRequired,
    onUploading: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onError: () => {},
    onUploaded: () => {},
    onUploading: () => {},
  }

  constructor(props) {
    super(props)

    this.attachDropzone = this._attachDropzone.bind(this)
    this.confirmAttachment = this._confirmAttachment.bind(this)
    this.onSending = this._onSending.bind(this)
    this.uploadAttachment = this._uploadAttachment.bind(this)

    this.state = {
      attachments: {},
    }
  }

  componentDidMount() {
    this.attachDropzone()
  }

  componentDidUpdate() {
    if (!this.dropzone) {
      this.attachDropzone()
    }
    this.dropzone.options.accept = this.uploadAttachment
  }

  componentWillUnmount() {
    this.dropzone = null
  }

  render() {
    return (
      <div ref="dropzone" className="relative clearfix">
        {this.props.children}
      </div>
    )
  }

  _attachDropzone() {
    this.dropzone = new Dropzone(React.findDOMNode(this.refs.dropzone), {
      accept: this.uploadAttachment,
      clickable: this.props.clickable,
      sending: this.onSending,
      success: this.confirmAttachment,
      url: `${S3_URL}`,
    })
  }

  _confirmAttachment(file) {
    const { attachments, } = this.state
    const { key, } = file.form
    const attachment = attachments[key]

    if (attachment) {
      this.props.onUploaded(attachment)

      delete attachments[key]

      this.setState({
        attachments: attachments,
      })
    }
  }

  // Sign the upload with data from the server
  // The server signs the payload for AWS S3 using the private key (which we
  // can't expose in the client), setting up the ACL, expiration, etc. We then
  // need to attach this information to the uploading file so that S3 accepts
  // it.
  _onSending(file, xhr, formData) {
    for (const k in file.form) {
      if (file.form.hasOwnProperty(k)) {
        formData.append(k, file.form[k])
      }
    }
  }

  // NOTE: (pletcher) Moving the upload call out of an action creator and
  // and into the component itself felt a bit funny at first, but it
  // seriously cuts down on upload complexity. Now we don't need to manage
  // state in multiple stores (and no store needs to know the details
  // about attachments), and we instead get a simple wrapper for hooking into
  // the upload API. (The store (`attachments`), for its part, just increments and decrements
  // the attachments going in and out of a given container.)
  _uploadAttachment(file, done) {
    const { dispatch, id, onError, onUploading, } = this.props

    onUploading(file)

    dispatch(AttachmentActions.uploading(id))

    api.post('attachments', {
      name: file.name,
      content_type: file.type,
      size: file.size,
    }).then(attachment => {
      const { attachments, } = this.state

      file.form = attachment.form
      attachment.name = file.name

      this.setState({
        attachments: {
          ...attachments,
          [attachment.form.key]: attachment,
        },
      })

      done()

      dispatch(AttachmentActions.uploaded(id))
    }).catch(error => {
      onError(error)

      dispatch(AttachmentActions.failed(id))
    })
  }
}
