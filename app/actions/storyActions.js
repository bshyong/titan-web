import * as c from 'constants'

export function update(changelogId, storyId, params) {
  return {
    types: [c.STORY_UPDATING, c.STORY_FETCHED, c.STORY_UPDATE_FAILED],
    promise: api => api.put(`changelogs/${changelogId}/stories/${storyId}`, params),
  }
}
