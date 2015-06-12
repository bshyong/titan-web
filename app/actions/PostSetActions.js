import {
  GROUP_COLLAPSED,
  SET_UPDATE_FAILED,
  SET_UPDATED,
  SET_UPDATING,
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {
  updateTitle(setId, title) {
    this.update(setId, { title: title })
  },

  finalize(setId) {
    this.update(setId, { done_at: new Date() })
  },

  collapse(groupKey) {
    Dispatcher.dispatch({type: GROUP_COLLAPSED, groupKey: groupKey})
  },

  update(setId, change) {
    Dispatcher.dispatch({
      type: SET_UPDATING,
      setId: setId,
      change: change
    })

    api.put(`groups/${setId}`, change).then(resp => {
      Dispatcher.dispatch({
        type: SET_UPDATED,
        set: resp
      })
    })
  }
}
