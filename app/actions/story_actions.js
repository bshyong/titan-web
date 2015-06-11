import {
  ANALYTICS_POST_CREATED,
  ANALYTICS_UPVOTE,
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
import { List } from 'immutable'

export default {

  fetchAll(changelogId, timeInterval, page=1, per=25) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING
    })
    api.get(`changelogs/${changelogId}/stories?page=${page}&per=${per}&time_interval=${timeInterval}`).
      then(resp => {
        let stories = List(resp)
        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          changelogId: changelogId,
          stories: stories,
          page: page,
          moreAvailable: stories.size === per
        })
      })
  },

  fetchSpecificDate(changelogId, dateString, timeInterval, page, per) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING
    })
    api.get(`changelogs/${changelogId}/stories?date=${dateString}&time_interval=${timeInterval}&page=${page}&per=${per}`).
      then(resp => {
        let stories = List(resp)
        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          changelogId: changelogId,
          stories: resp
        })
      })
  },

  fetch(changelogId, storyId) {
    api.get(`changelogs/${changelogId}/stories/${storyId}`).
      then(resp => {
        Dispatcher.dispatch({
          type: STORY_FETCHED,
          story: resp,
          changelogId: changelogId
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

        segment.track(ANALYTICS_POST_CREATED, {
          length: data.body.length
        })

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
