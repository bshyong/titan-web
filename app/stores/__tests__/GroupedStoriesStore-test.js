// app/stores/__tests__/GroupedStoriesStore-test.js

import {List} from 'immutable'
import {
  STORIES_FETCHED,
  STORY_DELETED,
  STORY_FETCHED,
} from '../../constants'

describe('GroupedStoriesStore', () => {
  let Dispatcher, GroupedStoriesStore

  beforeEach(() => {
    Dispatcher = require('../../lib/dispatcher')
    GroupedStoriesStore = require('../GroupedStoriesStore')
  })

  describe('STORY_FETCHED', () => {
    it('adds to set', () => {
      dispatchStory()

      expect(GroupedStoriesStore.get('foo').slug).toEqual('foo')
    })
  })


  describe('STORY_DELETED', () => {
    beforeEach(dispatchStories)

    it('removes a story from the GroupedStoriesStore', () => {
      Dispatcher.dispatch({
        type: STORY_DELETED,
        storyId: 'bar'
      })

      const stories = GroupedStoriesStore.grouped.first().stories
      expect(stories.size).toEqual(1)
      expect(stories.first().slug).toEqual('foo')
    })
  })

  function dispatchStories() {
    let groupedStories = [{
      group: {
        id: 1,
        title: '1.0.0'
      },
      stories: [
        { slug: 'foo', created_at: Date.now().toString() },
        { slug: 'bar', created_at: Date.now().toString() }
      ]
    }]

    Dispatcher.dispatch({
      type: STORIES_FETCHED,
      page: 1,
      grouped: List(groupedStories),
      changelogId: 'changelog'
    })
  }

  function dispatchStory() {
    Dispatcher.dispatch({
      type: STORY_FETCHED,
      story: { slug: 'foo' },
      group: { id: 1 },
      changelogId: 'changelog'
    })
  }
})
