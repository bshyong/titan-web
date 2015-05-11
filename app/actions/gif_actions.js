import Dispatcher from '../lib/dispatcher'
import api from 'lib/api'

export default {

  fetchGifs(string) {
    Dispatcher.dispatch({
      type: 'GIFS_FETCHING'
    })
    api.get(`http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(string)}`).then(resp => {
      Dispatcher.dispatch({
        type: 'GIFS_FETCHED',
        gifs: resp.data.map(g => g.images.fixed_height.url)
      })
    })
  }

}
