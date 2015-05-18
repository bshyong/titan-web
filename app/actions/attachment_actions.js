import {
  ATTACHMENT_FAILED,
  ATTACHMENT_UPLOADED,
  ATTACHMENT_UPLOADING
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

class AttachmentActions {
  uploadAttachment(commentId) {
    return (file, done) => _upload(commentId, file, done)
  }
}


module.exports = new AttachmentActions()

function _upload(commentId, file, done) {
  Dispatcher.dispatch({
    type: ATTACHMENT_UPLOADING,
    commentId: commentId,
    attachment: file
  })

  api.post('attachments', {
    name: file.name,
    content_type: file.type,
    size: file.size
  })
  .then(attachment => {
    file.form = attachment.form
    attachment.name = file.name

    Dispatcher.dispatch({
      type: ATTACHMENT_UPLOADED,
      commentId: commentId,
      attachment: attachment
    })

    done()
  })
}
