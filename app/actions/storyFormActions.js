import {
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR,
} from '../constants'

export function clearAll() {
  return {
    type: STORY_FORM_CLEAR,
  }
}

export function change(fields) {
  return {
    type: STORY_FORM_CHANGE,
    fields: fields,
  }
}
