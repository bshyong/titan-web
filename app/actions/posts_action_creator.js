import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'
import SessionStore from 'stores/session_store'

export default {

  fetchAll(org_id, params) {
    request({
      url: `${API_URL}/orgs/${org_id}/posts`,
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

  create(org_id, params) {
    Dispatcher.dispatch({
      type: 'POST_CREATING'
    })

    request({
      url: `${API_URL}/orgs/${org_id}/posts`,
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
