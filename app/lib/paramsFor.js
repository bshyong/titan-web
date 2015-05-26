export default {
  story: (changelog, story) => {
    var d = story.created_at.match(/(\d+)/g)
    return {
      changelogId: changelog.id,
      year: d[0],
      month: d[1],
      day: d[2],
      storyId: story.slug
    }
  }
}
