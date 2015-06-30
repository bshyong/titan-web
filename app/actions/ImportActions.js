import {
  IMPORT_FAILED,
  IMPORT_STARTED,
  IMPORT_STARTING,
} from 'constants'

export function importProject(changelogId, url) {
  return {
    types: [IMPORT_STARTING, IMPORT_STARTED, IMPORT_FAILED],
    promise: api => api.put(`changelogs/${changelogId}/import`, { url: url })
  }
}
