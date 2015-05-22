import { RESOURCE_NOT_FOUND, RESOURCE_FOUND } from '../constants'
import 'isomorphic-fetch'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {

  fetchGifs(string) {
    Dispatcher.dispatch({
      type: 'GIFS_FETCHING'
    })
    this.get(`http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(string)}`)
        .then(resp => {
          Dispatcher.dispatch({
            type: 'GIFS_FETCHED',
            gifs: resp.data.map(g => {
              return {
                ...g.images.fixed_height,
                embed_url: g.embed_url,
                id: g.id}
              }
            )
          })
        })
  },

  changeSearchTerm(string) {
    Dispatcher.dispatch({
      type: 'GIF_FORM_CHANGED',
      searchTerm: string
    })
  },

  get(url) {
    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${url}`, options).
      then(resp => resp.json()).
      then(json => {
        Dispatcher.dispatch({ type: RESOURCE_FOUND })
        return json
      }).
      catch(err => {
        if (err.status == 404) {
          Dispatcher.dispatch({ type: RESOURCE_NOT_FOUND })
        }
      })
  }
}
