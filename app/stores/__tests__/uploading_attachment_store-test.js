'use strict';

jest.dontMock('../uploading_attachment_store')

import { List } from 'immutable'

describe('UploadingAttachmentStore', () => {
  let ATTACHMENT_UPLOADING, UploadingAttachmentStore, callback, Dispatcher;

  beforeEach(() => {
    ATTACHMENT_UPLOADING = require('../../constants').ATTACHMENT_UPLOADING
    Dispatcher = require('../../lib/dispatcher')
    UploadingAttachmentStore = require('../uploading_attachment_store')
    callback = Dispatcher.register.mock.calls[0][0]
  })

  describe('getAttachments()', () => {
    beforeEach(() => {
      callback({
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
