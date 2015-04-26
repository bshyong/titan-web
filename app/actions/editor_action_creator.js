import Dispatcher from '../lib/dispatcher'

export default {

  typed(text) {
    Dispatcher.dispatch({
      type: 'EDITOR_TYPED',
      text: text
    })
  }

}
