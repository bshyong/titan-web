import {
  EMOJI_SELECTED,
  GITHUB_DRAFTS_LOADED,
  STORY_CREATING,
  STORY_FETCHED,
  STORY_FIELDS_EDIT,
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR,
  STORY_PUBLISHED,
} from '../constants'
import EMOJI_REGEX from '../lib/emoji_regex'
import moment from 'moment'
import { getPublishToTwitter } from 'lib/publishToTwitter'

const initialState = {
  created_at: moment(),
  title: null,
  body: '',
  contributors: '',
  team_member_only: false,
  emoji_id: null,
  isCreating: false,
  publishToTwitter: getPublishToTwitter(),
  errorMessage: 'Please enter a title and select an emoji',
}

function getErrorMessage(title, emojiId) {
  const trimmed = (title || '').replace(EMOJI_REGEX, '').trim()
  const titleValid = (trimmed && trimmed.length > 0)
  if (!emojiId && !titleValid) {
    return 'Please enter a title and select an emoji'
  } else if (!emojiId && titleValid) {
    return 'Please select an emoji'
  } else if (emojiId && !titleValid) {
    return 'Please enter a title'
  }
}

export default function storyFields(state = initialState, action) {
  switch (action.type) {
    case STORY_CREATING:
      return {
        ...state,
        isCreating: true,
      }
    case STORY_FIELDS_EDIT:
    case STORY_FETCHED:
      const contributors = action.resp.contributors.map(u => `@${u.username}`).join(',')
      return {
        created_at: action.resp.created_at,
        title: action.resp.title,
        body: action.resp.body,
        contributors,
        team_member_only: action.resp.team_member_only,
        emoji_id: action.resp.emoji.id,
        isCreating: false,
      }
    case GITHUB_DRAFTS_LOADED:
      if (action.drafts.length === 0) {
        return state
      }
      return {
        ...state,
        title: action.drafts[0].title,
        body: action.drafts[0].body,
        emoji_id: action.drafts[0].emoji_id,
        created_at: moment(action.drafts[0].updated_at).toISOString(),
        isPublic: true,
      }

    case STORY_FORM_CHANGE:
      return {
        ...state,
        ...action.fields,
        isCreating: false,
        errorMessage: getErrorMessage(action.fields.title, action.fields.emoji_id),
      }

    case EMOJI_SELECTED:
      return {
        ...state,
        emoji_id: action.value,
      }

    case STORY_FORM_CLEAR:
    case STORY_PUBLISHED:
      return initialState

    default:
      return state
  }
}
