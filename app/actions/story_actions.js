import { RESOURCE_NOT_FOUND, RESOURCE_FOUND } from 'constants'

import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'

export default {

  fetchAll(changelog_id, params) {
    request({
      url: `${API_URL}/changelogs/${changelog_id}/stories`,
      method: 'get',
      error: (err) => {
        if (err.status == 404) {
          Dispatcher.dispatch({type: RESOURCE_NOT_FOUND})
        }
      },
      success: (resp) => {
        Dispatcher.dispatch({type: RESOURCE_FOUND})
        Dispatcher.dispatch({
          type: 'STORIES_FETCHED',
          stories: resp
        })
      }
    })
  },

  publish(changelog_id, params) {
    Dispatcher.dispatch({
      type: 'STORY_CREATING'
    })

    request({
      url: `${API_URL}/changelogs/${changelog_id}/stories`,
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + SessionStore.jwt
      },
      data: {
        body: params.body
      },
      error: (err) => { },
      success: (resp) => {
        Dispatcher.dispatch({
          type: 'STORY_PUBLISHED',
          story: resp
        })

        RouterContainer.get().transitionTo('changelog', {
          changelogId: 'assembly'
        })
      }
    })
  }
}
