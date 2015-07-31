import {
  COMMENT_CREATING,
  GROUP_STORIES_FETCHED,
  FLAIRABLE_FLAIRING,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_DELETED,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PINNED,
  STORY_PUBLISHED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNPINNED,
  STORY_UNSUBSCRIBED,
  HEARTABLE_HEARTING,
  HEARTABLE_UNHEARTING,
} from '../constants'
import { List, OrderedMap } from 'immutable'

const initialState = {
  grouped: List(),
  page: 0,
  moreAvailable: true,
  loading: false,
}

function addStory(groups, story) {
  const groupIndex = groups.findIndex(g => g.stories.get(story.slug))
  if (groupIndex === -1) {
    return groups.push({
      group: story.group_id,
      stories: OrderedMap([[story.slug, story]]),
    })
  }

  return groups.set(
    groupIndex,
    groups.get(groupIndex).stories.set(story.slug, story)
  )
}

// I'm sure this could be done better with mergeWith
function addStories(groups, stories) {
  let newGroups = groups
  stories.forEach(newGroup => {
    const groupIndex = groups.findIndex(g => g.group.key === newGroup.group.key)
    if (groupIndex !== -1) {
      newGroup.stories.forEach(s => {
        newGroups = newGroups.set(
          groupIndex,
          newGroups.get(groupIndex).stories.set(s.slug, s)
        )
      })
    } else {
      newGroups = newGroups.push({
        group: newGroup.group,
        stories: OrderedMap(newGroup.stories.map(s => [s.slug, s])),
      })
    }
  })
  return newGroups
}

function updateStory(groups, slug, op) {
  const groupIndex = groups.findIndex(g => g.stories.get(slug))
  if (groupIndex === -1) {
    return groups
  }

  const group = groups.get(groupIndex)
  const story = group.stories.get(slug)
  return groups.set(
    groupIndex,
    group.stories.set({
      ...story,
      ...op(story),
    })
  )
}

function updateStoryById(groups, storyId, op) {
  const groupIndex = groups.findIndex(g => g.stories.find(s => s.id === storyId))
  if (groupIndex === -1) {
    return groups
  }

  const group = groups.get(groupIndex)
  const story = group.stories.find(s => s.id === storyId)
  return groups.set(
    groupIndex,
    group.stories.set({
      ...story,
      ...op(story),
    })
  )
}

function removeStory(groups, slug) {
  const groupIndex = groups.findIndex(g => g.stories.get(slug))
  if (groupIndex === -1) {
    return groups
  }

  const group = groups.get(groupIndex)
  return groups.set(
    groupIndex,
    group.stories.filterNot(s => s.id === slug),
  )
}

export default function groupedStories(state = initialState, action) {
  console.info(action.type, action)
  switch (action.type) {
    case COMMENT_CREATING:
      return {
        ...state,
        grouped: updateStory(state.grouped, action.storyId, s => ({
          live_comments_count: s.live_comments_count + 1,
        })),
      }

    case STORY_DELETED:
      return {
        ...state,
        grouped: removeStory(state.grouped, action.storyId),
      }

    case STORY_PINNED:
      return {
        ...state,
        grouped: updateStory(state.grouped, action.storyId, () => ({
          pinned_at: true,
        })),
      }

    case STORY_UNPINNED:
      return {
        ...state,
        grouped: updateStory(state.grouped, action.storyId, () => ({
          pinned_at: false,
        })),
      }

    case STORY_FETCHED:
      return {
        ...state,
        grouped: addStory(state.grouped, action.resp),
      }

    case HEARTABLE_HEARTING:
    case STORY_HEARTED:
      if (action.heartableType !== 'story') {
        return state
      }

      return {
        ...state,
        grouped: updateStoryById(state.grouped, action.heartableId, s => ({
          viewer_has_hearted: true,
          hearts_counst: s.hearts_count + 1,
        })),
      }

    case HEARTABLE_UNHEARTING:
    case STORY_UNHEARTED:
      return {
        ...state,
        grouped: updateStoryById(state.grouped, action.heartableId, s => ({
          viewer_has_hearted: false,
          hearts_counst: s.hearts_count - 1,
        })),
      }

    case FLAIRABLE_FLAIRING:
      return {
        ...state,
        grouped: updateStoryById(state.grouped, action.heartableId, s => ({
          viewer_has_flaired: true,
          hearts_counst: s.flairs_count + 1,
        })),
      }

    case STORY_SUBSCRIBED:
      return {
        ...state,
        grouped: updateStory(state.grouped, action.storyId, () => ({
          viewer_has_subscribed: true,
        })),
      }

    case STORY_UNSUBSCRIBED:
      return {
        ...state,
        grouped: updateStory(state.grouped, action.storyId, () => ({
          viewer_has_subscribed: false,
        })),
      }

    case GROUP_STORIES_FETCHED:
      return {
        ...state,
        loading: false,
        grouped: addStories(state.grouped, action.stories),
      }

    case STORIES_FETCHED:
      return {
        ...state,
        grouped: addStories(action.page === 1 ? List() : state.grouped, action.stories),
        page: action.page,
        moreAvailable: action.moreAvailable,
        loading: false,
      }

    case STORIES_FETCHING:
      return {
        ...state,
        grouped: action.page === 1 ? List() : state.grouped,
        loading: true,
      }

    case STORY_PUBLISHED:
      return {
        ...state,
        grouped: addStory(state.grouped, action.story),
      }

    default:
      return state
  }
}

//   get(slug) {
//     let group = this.grouped.find(g => g.stories.get(slug))
//     if (group) {
//       return group.stories.get(slug)
//     }
//   }
//
//   getById(id) {
//     let group = this.grouped.find(g => g.stories.find(story => story.id === id))
//     if (group) {
//       return group.stories.find(story => story.id === id)
//     }
//   }
//
//
//   get totalStoriesCount() {
//     return this.grouped.reduce((r, g) => {
//       return r + g.stories.size
//     }, 0)
//   }
//
//   get loading() {
//     return this._loading
//   }
//
//   get moreAvailable() {
//     return this._moreAvailable
//   }
//
//   get page() {
//     return this._page
//   }
// }
//
// function addParams(changelogSlug, story) {
//   story.urlParams = paramsFor.story({slug: changelogSlug}, story)
//   return story
// }
