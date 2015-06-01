describe('AttachmentStore', () => {
  let ATTACHMENT_FAILED, ATTACHMENT_UPLOADED, AttachmentStore, Dispatcher;

  beforeEach(() => {
    ATTACHMENT_FAILED = require('../../constants').ATTACHMENT_FAILED
    ATTACHMENT_UPLOADED = require('../../constants').ATTACHMENT_UPLOADED
    Dispatcher = require('../../lib/dispatcher')
    AttachmentStore = require('../attachment_store')
  })

  describe('getAttachment()', () => {
    beforeEach(() => {
      Dispatcher.dispatch({
        type: ATTACHMENT_UPLOADED,
        commentId: 1,
        attachment: { url: '/test.jpg', name: 'test.jpg' }
      })
    })

    it('gets the attachment matching the given commentId', () => {
      let attachment = AttachmentStore.getAttachment(1)

      expect(attachment.url).toEqual('/test.jpg')
      expect(attachment.name).toEqual('test.jpg')
    })
  })
})
