export default {
  changelog: (changelog) => {
    return {
      changelogId: changelog.slug
    }
  },

  story: (changelog, story) => {
    let d = story.created_at.match(/(\d+)/g)
    return {
      changelogId: changelog.slug,
      year: d[0],
      month: d[1],
      day: d[2],
      storyId: story.slug
    }
  }
}
