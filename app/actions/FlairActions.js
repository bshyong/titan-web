import {
  FLAIRABLE_FLAIRING,
  FLAIRABLE_FLAIRED,
  FLAIRABLE_FLAIRING_FAILED,
} from 'constants'

export function flair(flairable) {
  const { type: flairableType, id: flairableId } = flairable
  return {
    types: [
      FLAIRABLE_FLAIRING,
      FLAIRABLE_FLAIRED,
      FLAIRABLE_FLAIRING_FAILED,
    ],
    promise: api => api.post(`user/flairs/${flairableType}/${flairableId}`),
    flairableType,
    flairableId,
  }
}
