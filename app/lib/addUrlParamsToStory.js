export default function(changelogId, story) {
  var d = story.created_at.match(/(\d+)/g)
  story.urlParams = {
    changelogId: changelogId,
    year: d[0],
    month: d[1],
    day: d[2],
    storyId: story.slug
  }
  return story
}
