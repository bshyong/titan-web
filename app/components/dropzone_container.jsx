import AttachmentActions from '../actions/attachment_actions'
import AttachmentStore from '../stores/attachment_store'
import Dropzone from '../config/dropzone'
import Icon from './ui/icon.js.jsx'
import React from 'react'
import UploadingAttachmentStore from '../stores/uploading_attachment_store'

let UploadSrc = ''
if (typeof __TEST__ === 'undefined') {
  UploadSrc = require('../images/image-upload-icon.svg')
}

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
      clickable: React.findDOMNode(this.refs.clickable),
      sending: this.onSending,
      url: `https://s3.amazonaws.com/titan-api`
    })

    AttachmentStore.addChangeListener(this.getAttachments)
    UploadingAttachmentStore.addChangeListener(this.getUploadingAttachments)
  }

  componentDidUpdate() {
    this.dropzone.options.accept = AttachmentActions.uploadAttachment(this.props.id)
  }

  componentWillUnmount() {
    this.dropzone = null

    AttachmentStore.removeChangeListener(this.getAttachments)
    UploadingAttachmentStore.removeChangeListener(this.getUploadingAttachments)
  }

  render() {
    return (
      <div ref="dropzone" className="relative clearfix">
        {this.props.children}
        <div className="absolute right-0 top-0 mr1 mt1 h3 pointer gray" ref="clickable">
          <img src={UploadSrc} style={{height: '1.5rem'}} />
        </div>
      </div>
    )
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.id !== this.props.id) {
      return true
    }

    if (nextProps.children !== this.props.children) {
      return true
    }

    return false
  }

  _getAttachments() {
    let id = this.props.id
    let attachment = AttachmentStore.getAttachment(id)

    if (attachment) {
      this.props.onUploaded(attachment)
    }
  }

  _getUploadingAttachments() {
    let id = this.props.id
    let attachments = UploadingAttachmentStore.getAttachments(id)

    if (attachments.size) {
      this.props.onUploading(attachments)
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
