import request from 'reqwest'

import Dispatcher from '../lib/dispatcher'

export default {

  fetchAll(org_id, params) {
    request({
      url: `https://titan-api.herokuapp.com/orgs/${org_id}/posts`,
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
      url: `https://titan-api.herokuapp.com/orgs/${org_id}/posts`,
      method: 'post',
      data: {
        post: params
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
