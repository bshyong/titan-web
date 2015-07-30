import * as c from 'constants'
import api from 'lib/api'
import segment from 'lib/segment'

export function create(successCallback=() => {}) {
  return (dispatch, getState) => {
    const { newChangelog } = getState()
    const fields = newChangelog.fields.toJS()

    dispatch({
      type: c.CHANGELOG_CREATING,
      fields: fields,
    })

    api.post(`changelogs`, fields).
      then(resp => {
        dispatch({
          type: c.CHANGELOG_FETCHED,
          resp: resp,
        })
        segment.track(c.ANALYTICS_CHANGELOG_CREATED, {
          changelogId: resp.slug,
        })

        successCallback()
      }).catch(resp => {
        dispatch({
          type: c.CHANGELOG_CREATE_FAILED,
          errors: resp,
        })
      })
  }
}

export function formChange(field, value) {
  return {
    type: c.CHANGELOG_FORM_CHANGED,
    field: field,
    value: value,
  }
}
