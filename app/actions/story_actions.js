import {
  RESOURCE_NOT_FOUND,
  RESOURCE_FOUND,
  STORIES_FETCHED,
  STORY_CREATING,
  STORY_FETCHED,
  STORY_PUBLISHED,
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
  }
}
