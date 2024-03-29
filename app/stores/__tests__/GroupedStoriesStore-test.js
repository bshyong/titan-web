// app/stores/__tests__/GroupedStoriesStore-test.js

import {List} from 'immutable'
import {
  STORIES_FETCHED,
  STORY_DELETED,
  STORY_FETCHED,
  STORY_PUBLISHED,
} from '../../constants'

import reduce from '../groupedStories'

function dispatchStory(state) {
  return reduce(state, {
    type: STORY_FETCHED,
    resp: {
      slug: 'foo',
      group_id: 1,
    },
    changelogId: 'changelog',
  })
}

function dispatchPublish(state) {
  return reduce(state, {
    type: STORY_PUBLISHED,
    story: {
      slug: 'foo',
      group: { id: 1 },
    },
    changelogId: 'changelog',
  })
}


describe('GroupedStoriesStore', () => {
  describe('STORY_FETCHED', () => {
    it('adds to set', () => {
      const state = dispatchStory()

      expect(state.grouped.get(0).stories.find(s => s.slug === 'foo').slug).toEqual('foo')
    })
  })

  describe('STORY_PUBLISHED', () => {
    it('adds to a newly created set', () => {
      const state = dispatchPublish()

      expect(state.grouped.get(0).stories.find(s => s.slug === 'foo').slug).toEqual('foo')
    })
  })
  //
  //
  // describe('STORY_DELETED', () => {
  //   beforeEach(dispatchStories)
  //
  //   it('removes a story from the GroupedStoriesStore', () => {
  //     Dispatcher.dispatch({
  //       type: STORY_DELETED,
  //       storyId: 'bar'
  //     })
  //
  //     const stories = GroupedStoriesStore.grouped.first().stories
  //     expect(stories.size).toEqual(1)
  //     expect(stories.first().slug).toEqual('foo')
  //   })
  // })
  //
  // function dispatchStories() {
  //   let groupedStories = [{
  //     group: {
  //       id: 1,
  //       title: '1.0.0'
  //     },
  //     stories: [
  //       { slug: 'foo', created_at: Date.now().toString() },
  //       { slug: 'bar', created_at: Date.now().toString() }
  //     ]
  //   }]
  //
  //   Dispatcher.dispatch({
  //     type: STORIES_FETCHED,
  //     page: 1,
  //     grouped: List(groupedStories),
  //     changelogId: 'changelog'
  //   })
  // }
  //
})
