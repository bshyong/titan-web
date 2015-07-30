import c from 'constants'
import {List} from 'immutable'

function applyChanges(list, username, change) {
  const membership = {
    user: {
      username: username,
    },
    ...change,
  }
  const index = (list || List()).findIndex(m => m.user.username === username)
  if (index === -1) {
    return list.push(membership)
  }

  return list.set(index, membership)
}

const initialState = {
  errors: null,
  updateSuccessful: null,
  memberships: List(),
}

export default function memberships(state = initialState, action) {
  let list

  switch (action.type) {
    case c.CHANGELOG_MEMBERSHIPS_FETCHED:
      list = List(action.resp).sortBy(m => m.user.username.toLowerCase())
      return {
        ...state,
        memberships: list,
        core: list.filter(m => m.is_core),
      }

    case c.MEMBERSHIP_DELETED:
      list = state.memberships.filterNot(m => m.user.username === action.userId)
      return {
        ...state,
        memberships: list,
        core: list.filter(m => m.is_core),
      }

    case c.MEMBERSHIP_UPDATING:
      list = applyChanges(state.memberships, action.userId, action.change)
      return {
        ...state,
        errors: null,
        updateSuccessful: null,
        memberships: list,
        core: list.filter(m => m.is_core),
      }

    case c.MEMBERSHIP_UPDATED:
      list = applyChanges(state.memberships, action.userId, action.membership)
      return {
        ...state,
        errors: null,
        updateSuccessful: true,
        memberships: list,
        core: list.filter(m => m.is_core),
      }

    case c.MEMBERSHIP_UPDATE_FAILED:
      list = List(state.memberships).filterNot(m => m.user.username === action.userId)
      return {
        ...state,
        errors: action.errors,
        updateSuccessful: false,
        memberships: list,
        core: list.filter(m => m.is_core),
      }

    default:
      return state
  }
}
