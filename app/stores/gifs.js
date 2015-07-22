import shuffle from '../lib/shuffle'
import {List, Map} from 'immutable'
import c from 'constants'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  reactionImages: Map(),
  gifs: List(),
}

export default function gifs(state = initialState, action) {
  switch (action.type) {
    case c.GIFS_FETCHING:
      return {
        ...state,
        ...initialState,
        fetching: true,
      }
    case c.GIFS_FETCHED:
      return {
        ...state,
        page: 1,
        fetching: false,
        gifs: List(shuffle(action.gifs)),
      }
    case c.GIF_FORM_CHANGED:
      return {
        ...state,
        searchTerm: action.searchTerm,
      }
    case c.GIF_REACTION_FETCHED:
      return {
        ...state,
        reactionImages: state.reactionImages.set(action.reactionName, action.imageUrl),
      }
    case c.GIFS_FETCHED_FROM_STORE:
      return {
        ...state,
        page: action.page,
        moreAvailable: 20 * action.page < this.gifs.size,
      }

    default:
      return state
  }
}
