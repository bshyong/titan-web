import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'
import SessionStore from 'stores/session_store'

export default {

  fetchAll(changelog_id, params) {
    request({
      url: `${API_URL}/changelogs/${changelog_id}/stories`,
      method: 'get',
      error: (err) => {},
      success: (resp) => {
        Dispatcher.dispatch({
          type: 'STORIES_FETCHED',
          stories: resp
        })
      }
    })
  },

  create(changelog_id, params) {
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
      error: (err) => {},
      success: (resp) => {
        Dispatcher.dispatch({
          type: 'STORY_FETCH',
          story: resp
        })
      }
    })
  }
}
