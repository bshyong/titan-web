import {
  ATTACHMENT_FAILED,
  ATTACHMENT_UPLOADED,
  ATTACHMENT_UPLOADING
} from 'constants'

export function failed(id) {
  return {
    type: ATTACHMENT_FAILED,
    id: id,
  }
}

export function uploaded(id) {
  return {
    type: ATTACHMENT_UPLOADED,
    id: id,
  }
}

export function uploading(id) {
  return {
    type: ATTACHMENT_UPLOADING,
    id: id,
  }
}
