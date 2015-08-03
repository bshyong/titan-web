import {
  ANALYTICS_UPVOTE,
  HEARTABLE_HEARTING,
  HEARTABLE_HEARTED,
  HEARTABLE_HEARTING_FAILED,

  HEARTABLE_UNHEARTING,
  HEARTABLE_UNHEARTED,
  HEARTABLE_UNHEARTING_FAILED,
} from 'constants'

export function heart(heartableType, heartableId) {
  return {
    types: [HEARTABLE_HEARTING, HEARTABLE_HEARTED, HEARTABLE_HEARTING_FAILED],
    promise: api => api.put(`user/hearts/${heartableType}/${heartableId}`),
    analytics: [ANALYTICS_UPVOTE, {
      type: 'post',
      id: heartableId,
    }],
    heartableType,
    heartableId,
  }
}

export function unheart(heartableType, heartableId) {
  return {
    types: [HEARTABLE_UNHEARTING, HEARTABLE_UNHEARTED, HEARTABLE_UNHEARTING_FAILED],
    promise: api => api.delete(`user/hearts/${heartableType}/${heartableId}`),
    heartableType,
    heartableId,
  }
}

export function toggleHeart(heartable) {
  if (!heartable.viewer_has_hearted) {
    return heart(heartable.type, heartable.id)
  }

  return unheart(heartable.type, heartable.id)
}
