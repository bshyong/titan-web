import {
  ATTACHMENT_FAILED,
  ATTACHMENT_UPLOADED,
  ATTACHMENT_UPLOADING
} from 'constants.js'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'

class AttachmentActions {
  uploadAttachment(commentId) {
    let handler = (file, done) => {
      _upload(commentId, file, done)
    }

    return handler
  }
}


module.exports = new AttachmentActions()

function _upload(commentId, file, done) {
  Dispatcher.dispatch({
    actionType: ATTACHMENT_UPLOADING,
    commentId: commentId,
    text: '![Uploading... ' + file.name + ']()'
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
      actionType: ATTACHMENT_UPLOADED,
      commentId: commentId,
      attachment: attachment
    })

    done()
  })
}
