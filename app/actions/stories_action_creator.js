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
          type: 'POSTS_FETCHED',
          posts: resp
        })
      }
    })
  },

  create(changelog_id, params) {
    Dispatcher.dispatch({
      type: 'POST_CREATING'
    })

    request({
      url: `${API_URL}/changelogs/${changelog_id}/stories`,
      method: 'post',
      data: {
        post: {
          username: SessionStore.user.username,
          body: params.body
        }
      },
      error: (err) => {},
      success: (resp) => {
        Dispatcher.dispatch({
          type: 'POST_FETCH',
          post: resp
        })
      }
    })
  }

}
