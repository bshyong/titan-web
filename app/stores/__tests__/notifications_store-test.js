// app/stores/__tests__/notifications_store-test.js

describe('NotificationsStore', () => {
  let NOTIFICATIONS_ACKD,
      NOTIFICATIONS_FETCHED,
      NOTIFICATIONS_FETCHING,
      NOTIFICATIONS_READ,
      NotificationsStore,
      Dispatcher

  beforeEach(() => {
      NOTIFICATIONS_FETCHED = require('../../constants').NOTIFICATIONS_FETCHED
      Dispatcher = require('../../lib/dispatcher')
      NotificationsStore = require('../notifications_store')
    })

  describe('get notifications()', () => {
    beforeEach(() => {
      Dispatcher.dispatch({
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
