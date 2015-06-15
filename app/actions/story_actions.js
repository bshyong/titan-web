import {
  ANALYTICS_POST_CREATED,
  ANALYTICS_UPVOTE,
  GROUP_STORIES_FETCHED,
  RESOURCE_NOT_FOUND,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_CREATING,
  STORY_DELETED,
  STORY_EDITING,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PUBLISHED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNSUBSCRIBED,
  STORY_UPDATED,
} from '../constants'

import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import api from '../lib/api'
import segment from '../lib/segment'
import { List, Map } from 'immutable'

export default {

  fetchAll(changelogId, options, page=1, per=25) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING,
      page: page
    })
    api.get(`changelogs/${changelogId}/stories?page=${page}&per=${per}&group_by=${options.group_by}`).
      then(resp => {
        let stories = List(resp)
        let counts = stories.map(g => g.stories.length)
        let count = counts.reduce((a, b) => a + b, 0)

        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          changelogId: changelogId,
          grouped: stories,
          page: page,
          moreAvailable: count === per
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

  delete(changelogId, storyId) {
    Dispatcher.dispatch({
      type: STORY_DELETED,
      storyId: storyId
    })
    api.delete(`changelogs/${changelogId}/stories/${storyId}`)
    RouterContainer.get().transitionTo("changelog", {changelogId: changelogId})
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

        RouterContainer.get().transitionTo('story', story.urlParams)
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

  publish(changelogId, data) {
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

        RouterContainer.get().transitionTo('story', story.urlParams)
      })
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
