import c from 'constants'

export default function currentChangelog(state = {}, action) {
  switch (action.type) {
    case c.CHANGELOG_FETCHED:
      return {
        ...state,
        changelog: action.resp,
        errors: null,
      }

    case c.CHANGELOG_CHANGED:
      return {
        ...state,
        changelog: action.changelog,
      }

    case c.CHANGELOG_CURRENT_CLEARED:
      return {
        ...state,
        changelog: null,
      }

    case c.CHANGELOG_FOLLOWED:
      return {
        ...state,
        changelog: {
          ...state.changelog,
          viewer_is_follower: true,
        },
      }

    case c.CHANGELOG_UNFOLLOWED:
      return {
        ...state,
        changelog: {
          ...state.changelog,
          viewer_is_follower: false,
        },
      }

    case c.CHANGELOG_UPDATING:
      return {
        ...state,
        errors: null,
        updateSuccessful: null,
        saving: true,
        changelog: {
          ...state.changelog,
          ...action.params,
        },
      }

    case c.CHANGELOG_UPDATED:
      return {
        ...state,
        changelog: action.resp,
        updateSuccessful: true,
        saving: false,
      }

    case c.CHANGELOG_UPDATE_FAILED:
      return {
        errors: action.errors,
        updateSuccessful: false,
        saving: false,
      }

    case c.INVITATION_RESET:
      return {
        ...state,
        invite_hash: action.hash,
      }

    default:
      return state
  }
}
