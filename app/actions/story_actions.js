import {
  RESOURCE_NOT_FOUND,
  RESOURCE_FOUND,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_CREATING,
  STORY_EDITING,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PUBLISHED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNSUBSCRIBED,
  STORY_UPDATED
} from '../constants'

import addParams from '../lib/addUrlParamsToStory'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import { List } from 'immutable'

export default {

  fetchAll(changelogId, timeInterval, page=1, per=25) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING
    })
    api.get(`changelogs/${changelogId}/stories?page=${page}&per=${per}&time_length=${timeInterval}`).
      then(resp => {
        let stories = List(resp).map(combineAuthorAndContributors)
        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          changelogId: changelogId,
          stories: stories,
          page: page,
          moreAvailable: stories.size == per
        })
      })
  },

  fetchSpecificDate(changelogId, dateString, timeInterval) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING
    })
    api.get(`changelogs/${changelogId}/stories?date=${dateString}&time_length=${timeInterval}`).
      then(resp => {
        let stories = List(resp).map(combineAuthorAndContributors)
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
          story: combineAuthorAndContributors(resp),
          changelogId: changelogId
        })
      })
  },

  edit(changelogId, storyId, data) {
    Dispatcher.dispatch({
      type: STORY_EDITING
    })

    api.put(`changelogs/${changelogId}/stories/${storyId}`, data).
      then(resp => {
        let story = addParams(changelogId, combineAuthorAndContributors(resp))
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
    api.put(`user/hearts/stories/${storyId}`)
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
        let story = addParams(changelogId, combineAuthorAndContributors(resp))
        Dispatcher.dispatch({
          type: STORY_PUBLISHED,
          story: story,
          changelogId: changelogId
        })

        RouterContainer.get().transitionTo('story', story.urlParams)
        analytics.track('Wrote Story', {
          storyLength: data.body.length
        })
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

function combineAuthorAndContributors(story) {
  story.allContributors = List(story.contributors)
  if (!story.allContributors.find(c => story.user.id == c.id)) {
    story.allContributors = story.allContributors.concat(story.user)
  }
  return story
}
