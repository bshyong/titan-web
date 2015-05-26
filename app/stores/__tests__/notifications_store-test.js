// app/stores/__tests__/notifications_store-test.js
'use strict'

jest.dontMock('../notifications_store')

describe('NotificationsStore', () => {
  let NOTIFICATIONS_ACKD,
      NOTIFICATIONS_FETCHED,
      NOTIFICATIONS_FETCHING,
      NOTIFICATIONS_READ,
      NotificationsStore,
      callback,
      Dispatcher

  beforeEach(() => {
      NOTIFICATIONS_FETCHED = require('../../constants').NOTIFICATIONS_FETCHED
      Dispatcher = require('../../lib/dispatcher')
      NotificationsStore = require('../notifications_store')
      callback = Dispatcher.register.mock.calls[0][0]
    })

  describe('get notifications()', () => {
    beforeEach(() => {
      callback({
        type: NOTIFICATIONS_FETCHED,
        notifications: [
          {story_id: 'newest', updated_at: Date.now() + 100000},
          {story_id: 'oldest', updated_at: Date.now() + 25000},
          {story_id: 'older', updated_at: Date.now() + 50000},
        ]
      })
    })

    it('gets the notifications sorted by updated_at', () => {
      let notifications = NotificationsStore.notifications

      expect(notifications.size).toEqual(3)
      expect(notifications.get(0).story_id).toEqual('newest')
      expect(notifications.get(2).story_id).toEqual('oldest')
    })
  })

})
