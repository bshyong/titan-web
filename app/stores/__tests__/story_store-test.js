// app/stores/__tests__/story_store-test.js

import constants from '../../constants'

describe('StoryStore', () => {
  let Dispatcher, StoryStore, STORY_DELETED, STORIES_FETCHED

  beforeEach(() => {
    STORY_DELETED = constants.STORY_DELETED
    STORIES_FETCHED = constants.STORIES_FETCHED
    Dispatcher = require('../../lib/dispatcher')
    StoryStore = require('../story_store')
  })

  describe('STORY_DELETED', () => {
    beforeEach(() => {
      Dispatcher.dispatch({
        type: STORIES_FETCHED,
        stories: [
          { slug: 'foo', created_at: Date.now().toString() },
          { slug: 'bar', created_at: Date.now().toString() }
        ],
        changelogId: 'changelog'
      })
    })

    it('removes a story from the StoryStore', () => {
      Dispatcher.dispatch({
        type: STORY_DELETED,
        storyId: 'bar'
      })

      const stories = StoryStore.all()
      expect(stories.size).toEqual(1)
      expect(stories.first().slug).toEqual('foo')
    })
  })
})
