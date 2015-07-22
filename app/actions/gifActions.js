import c from '../constants'
import {apiUrl} from '../config/gifpicker'

function getJSON(url) {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }

  return fetch(`${url}`, options).then(resp => resp.json())
}

function extractGifs(resp) {
  return resp.data.map(g => {
    return {
      ...g.images.fixed_height_small,
      url: g.images.fixed_height.url,
      small_url: g.images.fixed_height_small.url,
      still_url: g.images.fixed_height_small_still.url,
      embed_url: g.embed_url,
      id: g.id,
    }
  })
}

export function fetchGifs(string) {
  return dispatch => {
    dispatch({type: c.GIFS_FETCHING})

    getJSON(`${apiUrl}?api_key=${GIPHY_API_KEY}&limit=100&q=${encodeURIComponent(string)}`).
      then(resp => {
        dispatch({
          type: c.GIFS_FETCHED,
          gifs: extractGifs(resp),
        })
      })
  }
}

export function fetchImagesForReactions(reactions) {
  return dispatch => {
    reactions.forEach(reaction => {
      getJSON(`${apiUrl}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(reaction)}`).
        then(resp => {
          dispatch({
            type: c.GIF_REACTION_FETCHED,
            reactionName: reaction,
            imageUrl: resp.data[0].images.fixed_height_small_still.url,
          })
        })
    })
  }
}

export function getFromStore(page=1) {
  return {
    page: page,
    type: c.GIFS_FETCHED_FROM_STORE,
  }
}

export function changeSearchTerm(string) {
  return {
    type: c.GIF_FORM_CHANGED,
    searchTerm: string,
  }
}

export function clearGifs() {
  return {
    type: c.GIFS_CLEAR,
  }
}
