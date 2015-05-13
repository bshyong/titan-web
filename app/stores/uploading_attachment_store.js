import { ATTACHMENT_UPLOADING } from 'constants.js'
import Dispatcher from 'lib/dispatcher'
import { List, Map } from 'immutable'
import Store from 'lib/store'

class UploadingAttachmentsStore extends Store {
  constructor() {
    super()

    this.attachments = Map()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.actionType) {
        case ATTACHMENT_UPLOADING:
          let { commentId, attachment } = action
          this.attachments = this.attachments.set(
            commentId,
            (this.attachments.get(commentId) || List()).push(attachment)
          )
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  getAttachments(commentId) {
    const attachments = this.attachments.get(commentId) || List()

    this.attachments = this.attachments.remove(commentId)

    return attachments
  }
}

module.exports = new UploadingAttachmentsStore()
