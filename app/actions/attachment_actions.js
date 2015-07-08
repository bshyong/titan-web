import {
  ATTACHMENT_FAILED,
  ATTACHMENT_SUCCEEDED,
  ATTACHMENT_UPLOADED,
  ATTACHMENT_UPLOADING
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {
  confirmAttachment() {
    Dispatcher.dispatch({
      type: ATTACHMENT_SUCCEEDED
    })
  },

  uploadAttachment(commentId) {
    return (file, done) => _upload(commentId, file, done)
  }
}

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
  }).
  then(attachment => {
    file.form = attachment.form
    attachment.name = file.name

    done()

    Dispatcher.dispatch({
      type: ATTACHMENT_UPLOADED,
      commentId: commentId,
      attachment: attachment
    })
  })
}
