import { List } from 'immutable'

describe('UploadingAttachmentStore', () => {
  let ATTACHMENT_UPLOADING, UploadingAttachmentStore, Dispatcher;

  beforeEach(() => {
    ATTACHMENT_UPLOADING = require('../../constants').ATTACHMENT_UPLOADING
    Dispatcher = require('../../lib/dispatcher')
    UploadingAttachmentStore = require('../uploading_attachment_store')
  })

  describe('getAttachments()', () => {
    beforeEach(() => {
      Dispatcher.dispatch({
        type: ATTACHMENT_UPLOADING,
        commentId: 1,
        attachment: { url: '/idea.jpg' }
      })
    })

    it('gets the attachments that match the given commentId', () => {
      expect(
        UploadingAttachmentStore.getAttachments(1).get(0).url
      ).toEqual('/idea.jpg')
    })
  })
})
