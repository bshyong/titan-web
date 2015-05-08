import {
  RESOURCE_NOT_FOUND,
  RESOURCE_FOUND,
  STORIES_FETCHED,
  STORY_CREATING,
  STORY_EDITING,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PUBLISHED,
  STORY_UNHEARTED,
} from 'constants'

import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'

export default {

  fetchAll(changelogId, params) {
    api.get(`changelogs/${changelogId}/stories`).
      then(resp => {
        Dispatcher.dispatch({
          type: STORIES_FETCHED,
          stories: resp
        })
      })
  },

  fetch(changelogId, storyId) {
    api.get(`changelogs/${changelogId}/stories/${storyId}`).
      then(resp => {
        Dispatcher.dispatch({
          type: STORY_FETCHED,
          story: resp
        })
      })
  },

  edit(changelogId, storyId, data) {
    Dispatcher.dispatch({
      type: STORY_EDITING
    })

    api.post(`changelogs/${changelogId}/stories/${storyId}`, data).
      then(resp => {
        Dispatcher.dispatch({
          type: 'STORY_UPDATED',
          story: resp
        })

        RouterContainer.get().transitionTo('changelog', {
          changelogId: changelogId
        })
      })
  },

  heart(storyId) {
    api.put(`user/hearts/stories/${storyId}`)
    Dispatcher.dispatch({
      type: STORY_HEARTED
    })
  },

  publish(changelog_id, data) {
    Dispatcher.dispatch({
      type: STORY_CREATING
    })

    api.post(`changelogs/${changelog_id}/stories`, data).
      then(resp => {
        Dispatcher.dispatch({
          type: 'STORY_PUBLISHED',
          story: resp
        })

        RouterContainer.get().transitionTo('changelog', {
          changelogId: changelog_id
        })
        analytics.track('Wrote Story', {
          storyLength: data.body.length
        })
      })
  },

  unheart(storyId) {
    api.delete(`user/hearts/stories/${storyId}`)
    Dispatcher.dispatch({
      type: STORY_UNHEARTED
    })
  }
}
