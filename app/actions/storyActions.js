import * as c from 'constants'

export function editStory(story) {
  return {
    type: c.STORY_FIELDS_EDIT,
    resp: story,
  }
}

export function fetch(changelogId, storyId) {
  return {
    types: [c.STORY_FETCHING, c.STORY_FETCHED, c.STORY_FETCH_FAILED],
    promise: api => api.get(`changelogs/${changelogId}/stories/${storyId}?include=group`),
  }
}

export function update(changelogId, storyId, params) {
  return {
    types: [c.STORY_UPDATING, c.STORY_FETCHED, c.STORY_UPDATE_FAILED],
    promise: api => api.put(`changelogs/${changelogId}/stories/${storyId}`, params),
  }
}
