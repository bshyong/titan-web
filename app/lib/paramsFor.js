export default {
  changelog: (changelog) => {
    let params = {}
    if (changelog.domain) {
      params.domain = changelog.domain
    } else {
      params.changelogId = changelog.slug
    }
    return params
  },

  story: (changelog, story) => {
    let d = story.created_at.match(/(\d+)/g)
    let params = {
      year: d[0],
      month: d[1],
      day: d[2],
      storyId: story.slug
    }

    if (changelog.domain || changelog.slug.indexOf('.') !== -1) {
      params.domain = changelog.domain || changelog.slug
    } else {
      params.changelogId = changelog.slug
    }

    return params
  }
}
