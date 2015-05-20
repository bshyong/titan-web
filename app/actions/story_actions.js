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
  STORY_UNHEARTED,
  STORY_UPDATED
} from '../constants'

import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import { List } from 'immutable'

export default {

  fetchAll(changelogId, timeLength, page=1, per=25) {
    Dispatcher.dispatch({
      type: STORIES_FETCHING
    })
    api.get(`changelogs/${changelogId}/stories?page=${page}&per=${per}&time_length=${timeLength}`).
      then(resp => {
        var stories = List(resp).map(combineAuthorAndContributors)
        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          changelogId: changelogId,
          stories: stories,
          page: page,
          moreAvailable: stories.size == per
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
        Dispatcher.dispatch({
          type: STORY_UPDATED,
          story: resp,
          changelogId: changelogId,
        })

        RouterContainer.get().transitionTo('changelog', {
          changelogId: changelogId,
          storyId: storyId
        })
      })
  },

  clickHeart(story) {
    if (SessionStore.isSignedIn()) {
      if (!story.viewer_has_hearted) {
        this.heart(story.slug)
      } else {
        this.unheart(story.slug)
      }
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
        Dispatcher.dispatch({
          type: STORY_PUBLISHED,
          story: combineAuthorAndContributors(resp),
          changelogId: changelogId
        })

        RouterContainer.get().transitionTo('changelog', {
          changelogId: changelogId
        })
        analytics.track('Wrote Story', {
          storyLength: data.body.length
        })
      })
  },

  unheart(storyId) {
    api.delete(`user/hearts/stories/${storyId}`)
    Dispatcher.dispatch({
      type: STORY_UNHEARTED,
      storyId: storyId
    })
  }
}

function combineAuthorAndContributors(story) {
  story.allContributors = List(story.contributors)
  if (!story.allContributors.find(c => story.user.id == c.id)) {
    story.allContributors = story.allContributors.concat(story.user)
  }
  return story
}
