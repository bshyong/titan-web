import {
  ANALYTICS_POST_CREATED,
  ANALYTICS_UPVOTE,
  FEED_STORIES_FETCHED,
  GROUP_STORIES_FETCHED,
  PINNED_POSTS_FETCHED,
  PINNED_POSTS_FETCHING,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_CREATING,
  STORY_DELETED,
  STORY_EDITING,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PINNED,
  STORY_PUBLISHED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNPINNED,
  STORY_UNSUBSCRIBED,
  STORY_UPDATED,
} from '../constants'

import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import Router from '../lib/router_container'
import api from '../lib/api'
import segment from '../lib/segment'
import { List } from 'immutable'

export default {

  fetchAll(changelogId, options, page=1, per=25) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING,
      page,
    })
    api.get(`changelogs/${changelogId}/stories?page=${page}&per=${per}&group_by=${options.group_by}`).
      then(resp => {
        const stories = List(resp)
        const counts = stories.map(g => g.stories.length)
        const count = counts.reduce((a, b) => a + b, 0)

        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          changelogId,
          grouped: stories,
          page,
          moreAvailable: count === per,
        })
      })
  },

  fetchSpecificDate(changelogId, dateString, page, per) {
    api.get(`changelogs/${changelogId}/stories?filter=date:${dateString}&page=${page}&per=${per}`).
      then(resp => {
        let stories = List(resp)
        let counts = stories.map(g => g.stories.length)
        let count = counts.reduce((a, b) => a + b, 0)

        Dispatcher.dispatch({
          type: GROUP_STORIES_FETCHED,
          changelogId: changelogId,
          grouped: stories,
          page: page,
          moreAvailable: count === per
        })
      })
  },

  fetch(changelogId, storyId) {
    api.get(`changelogs/${changelogId}/stories/${storyId}?include=group`).
      then(resp => {
        Dispatcher.dispatch({
          type: STORY_FETCHED,
          story: resp,
          changelogId: changelogId
        })
      })
  },

  fetchPinned(changelogId, page, per) {
    Dispatcher.dispatch({
      type: PINNED_POSTS_FETCHING
    })

    api.get(`changelogs/${changelogId}/stories?filter=pinned&page=${page}&per=${per}`).
      then(resp => {
        const stories = List(resp)

        Dispatcher.dispatch({
          type: PINNED_POSTS_FETCHED,
          stories: stories,
          page: page,
          per: per,
          moreAvailable: stories.size === per
        })
      })
  },

  fetchForSpecificGroup(changelogId, groupId, page, per) {
    api.get(`changelogs/${changelogId}/stories?filter=group:${groupId}&page=${page}&per=${per}`).
      then(resp => {
        let stories = List(resp)
        let counts = stories.map(g => g.stories.length)
        let count = counts.reduce((a, b) => a + b, 0)

        Dispatcher.dispatch({
          type: GROUP_STORIES_FETCHED,
          grouped: stories,
          page: page,
          per: per,
          moreAvailable: count === per
        })
      })
  },

  fetchFeed(page=1, per=10) {
    api.get(`feed?page=${page}&per=${per}`).
      then(resp => {
        let stories = List(resp)
        Dispatcher.dispatch({
          type: FEED_STORIES_FETCHED,
          stories,
          page,
          per,
        })
      })
  },

  delete(changelogId, storyId) {
    api.delete(`changelogs/${changelogId}/stories/${storyId}`).
      then(() => {
        Dispatcher.dispatch({
          type: STORY_DELETED,
          storyId: storyId
        })
        Router.transitionTo("changelog", {changelogId: changelogId})
      })
  },

  edit(changelogId, storyId, data) {
    Dispatcher.dispatch({
      type: STORY_EDITING
    })

    api.put(`changelogs/${changelogId}/stories/${storyId}`, data).
      then(resp => {
        let story = addParams(changelogId, resp)
        Dispatcher.dispatch({
          type: STORY_UPDATED,
          story: story,
          changelogId: changelogId,
        })
        Router.get().transitionTo('story', story.urlParams)
      })
  },

  clickHeart(story) {
    if (!story.viewer_has_hearted) {
      this.heart(story.slug)
    } else {
      this.unheart(story.slug)
    }
  },

  heart(storyId) {
    api.put(`user/hearts/stories/${storyId}`).then(resp => {
      segment.track(ANALYTICS_UPVOTE, {
        type: 'post',
        id: storyId
      })
    })
    Dispatcher.dispatch({
      type: STORY_HEARTED,
      storyId: storyId
    })
  },

  publish(
    changelogId,
    data,
    shouldTransition = true,
    successCallback = (() => {})
  ) {
    Dispatcher.dispatch({
      type: STORY_CREATING
    })

    api.post(`changelogs/${changelogId}/stories`, data).
      then(resp => {
        let story = addParams(changelogId, resp)

        Dispatcher.dispatch({
          type: STORY_PUBLISHED,
          story: story,
          changelogId: changelogId
        })

        segment.track(ANALYTICS_POST_CREATED, {
          titleLength: story.title.length,
          bodyLength: (story.body && story.body.length) || 0
        })

        successCallback(story)
        if (shouldTransition) {
          Router.get().transitionTo('story', story.urlParams)
        }
      })
  },

  pin(changelogId, storyId) {
    Dispatcher.dispatch({
      type: STORY_PINNED,
      storyId: storyId
    })
    api.put(`changelogs/${changelogId}/stories/${storyId}/pin`)
  },

  unpin(changelogId, storyId) {
    Dispatcher.dispatch({
      type: STORY_UNPINNED,
      storyId: storyId
    })
    api.put(`changelogs/${changelogId}/stories/${storyId}/unpin`)
  },

  subscribe(storyId) {
    api.put(`user/subscriptions/stories/${storyId}`)
    Dispatcher.dispatch({
      type: STORY_SUBSCRIBED,
      storyId: storyId
    })
  },

  unheart(storyId) {
    api.delete(`user/hearts/stories/${storyId}`)
    Dispatcher.dispatch({
      type: STORY_UNHEARTED,
      storyId: storyId
    })
  },

  unsubscribe(storyId) {
    api.delete(`user/subscriptions/stories/${storyId}`)
    Dispatcher.dispatch({
      type: STORY_UNSUBSCRIBED,
      storyId: storyId
    })
  },
}

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}
