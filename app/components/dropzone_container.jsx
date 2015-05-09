import AttachmentActions from 'actions/attachment_actions'
import AttachmentStore from 'stores/attachment_store'
import Dropzone from 'dropzone'
import React from 'react'
import UploadingAttachmentsStore from 'stores/uploading_attachment_store'

Dropzone.autoDiscover = false

export default class DropzoneContainer extends React.Component {
  constructor(props) {
    super(props)

    this.getAttachments = this._getAttachments.bind(this)
    this.getUploadingAttachments = this._getUploadingAttachments.bind(this)
    this.onSending = this._onSending.bind(this)
  }

  componentDidMount() {
    this.dropzone = new Dropzone(React.findDOMNode(this.refs.dropzone), {
      accept: AttachmentActions.uploadAttachment(this.props.id),
      clickable: false,
      sending: this.onSending,
      url: `https://s3.amazonaws.com/titan-api`
    })

    AttachmentStore.addChangeListener(this.getAttachments)
    UploadingAttachmentsStore.addChangeListener(this.getUploadingAttachments)
  }

  componentWillUnmount() {
    this.dropzone = null

    AttachmentStore.removeChangeListener(this.getAttachments)
    UploadingAttachmentsStore.removeChangeListener(this.getUploadingAttachments)
  }

  render() {
    return <div ref="dropzone">{this.props.children}</div>;
  }

  _getAttachments() {
    let id = this.props.id
    let attachment = AttachmentStore.getAttachments(id)

    this.props.onUploaded(
      `![Uploading... ${attachment.name}]()`,
      `![${attachment.name}](${attachment.firesize_url}/${attachment.href})\n`
    )
  }

  _getUploadingAttachments() {
    let id = this.props.id
    let attachments = UploadingAttachmentsStore.getAttachments(id)

    if (attachments.size) {
      this.props.onUploading(attachments.join(' '))
    }
  }

  // Sign the upload with data from the server
  // The server signs the payload for AWS S3 using the private key (which we
  // can't expose in the client), setting up the ACL, expiration, etc. We then
  // need to attach this information to the uploading file so that S3 accepts
  // it.
  _onSending(file, xhr, formData) {
    for (let k in file.form) {
      formData.append(k, file.form[k])
    }
  }
}

DropzoneContainer.propTypes = {
  id: React.PropTypes.string.isRequired,
  onUploaded: React.PropTypes.func.isRequired,
  onUploading: React.PropTypes.func.isRequired
}
