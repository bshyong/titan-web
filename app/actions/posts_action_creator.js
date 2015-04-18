import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'

export default {

  fetchAll(org_id, params) {
    request({
      url: `${ASSEMBLY_API_HOST}/orgs/${org_id}/posts`,
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
      url: `${ASSEMBLY_API_HOST}/orgs/${org_id}/posts`,
      method: 'post',
      data: {
        post: {
          username: 'chrislloyd',
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
