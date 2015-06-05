import { RESOURCE_NOT_FOUND,
         GIFS_FETCHING,
         GIFS_FETCHED,
         GIFS_FETCHED_FROM_STORE,
         GIF_FORM_CHANGED,
         GIF_REACTION_FETCHED } from '../constants'
import 'isomorphic-fetch'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import {apiUrl} from '../config/gifpicker'

export default {

  fetchGifs(string) {
    Dispatcher.dispatch({
      type: GIFS_FETCHING
    })
    this.get(`${apiUrl}?api_key=${GIPHY_API_KEY}&limit=100&q=${encodeURIComponent(string)}`)
        .then(resp => {
          Dispatcher.dispatch({
            type: GIFS_FETCHED,
            gifs: resp.data.map(g => {
              return {
                ...g.images.fixed_height_small,
                url: g.images.fixed_height.url,
                small_url: g.images.fixed_height_small.url,
                still_url: g.images.fixed_height_small_still.url,
                embed_url: g.embed_url,
                id: g.id}
              }
            )
          })
        })
  },

  fetchImagesForReactions(reactions) {
    reactions.forEach((reaction, i) => {
      this.get(`${apiUrl}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(reaction)}`)
          .then(resp => {
            Dispatcher.dispatch({
              type: GIF_REACTION_FETCHED,
              reactionName: reaction,
              imageUrl: resp.data[0].images.fixed_height_small_still.url
            })
          })
    })
  },

  getFromStore(page=1) {
    Dispatcher.dispatch({
      page: page,
      type: GIFS_FETCHED_FROM_STORE,
    })
  },

  changeSearchTerm(string) {
    Dispatcher.dispatch({
      type: GIF_FORM_CHANGED,
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
      catch(err => {
        if (err.status == 404) {
          Dispatcher.dispatch({ type: RESOURCE_NOT_FOUND })
        }
      })
  }
}
