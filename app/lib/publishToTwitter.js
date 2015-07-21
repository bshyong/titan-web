
export function getPublishToTwitter() {
  const shouldPublish = localStorage.getItem('publishToTwitter')
  return shouldPublish == null ? 'true' :
    shouldPublish === 'false' ? false : true
}

export function setPublishToTwitter(value) {
  localStorage.setItem('publishToTwitter', value.toString())
}
