import { List } from 'immutable'
import * as c from 'constants'
import api from 'lib/api'
import ContributorsStore from 'stores/ContributorsStore'
import paramsFor from 'lib/paramsFor'
import Router from 'lib/router_container'
import segment from 'lib/segment'

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}

export function fetchAll(changelogId, options, page=1, per=25) {
  return dispatch => {
    dispatch({
      type: c.STORIES_FETCHING,
      page,
    })
    api.get(`changelogs/${changelogId}/stories?page=${page}&per=${per}&group_by=${options.group_by}`).
      then(resp => {
        const stories = List(resp)
        const counts = stories.map(g => g.stories.length)
        const count = counts.reduce((a, b) => a + b, 0)

        dispatch({
          type: c.STORIES_FETCHED,
          changelogId,
          grouped: stories,
          page,
          moreAvailable: count === per,
        })
      })
  }
}

export function fetchSpecificDate(changelogId, dateString, page, per) {
  return dispatch => {
    api.get(`changelogs/${changelogId}/stories?filter=date:${dateString}&page=${page}&per=${per}`).
      then(resp => {
        const stories = List(resp)
        const counts = stories.map(g => g.stories.length)
        const count = counts.reduce((a, b) => a + b, 0)

        dispatch({
          type: c.GROUP_STORIES_FETCHED,
          changelogId: changelogId,
          grouped: stories,
          page: page,
          moreAvailable: count === per,
        })
      })
  }
}

export function fetchPinned(changelogId, page, per) {
  return dispatch => {
    dispatch({
      type: c.PINNED_POSTS_FETCHING,
    })

    api.get(`changelogs/${changelogId}/stories?filter=pinned&page=${page}&per=${per}`).
      then(resp => {
        const stories = List(resp)

        dispatch({
          type: c.PINNED_POSTS_FETCHED,
          stories: stories,
          page: page,
          per: per,
          moreAvailable: stories.size === per,
        })
      })
  }
}

export function fetchForSpecificGroup(changelogId, groupId, page, per) {
  return dispatch => {
    api.get(`changelogs/${changelogId}/stories?filter=group:${groupId}&page=${page}&per=${per}`).
      then(resp => {
        const stories = List(resp)
        const counts = stories.map(g => g.stories.length)
        const count = counts.reduce((a, b) => a + b, 0)

        dispatch({
          type: c.GROUP_STORIES_FETCHED,
          grouped: stories,
          page: page,
          per: per,
          moreAvailable: count === per,
        })
      })
  }
}

export function fetchFeed(page=1, per=10) {
  return dispatch => {
    api.get(`feed?page=${page}&per=${per}`).
      then(resp => {
        dispatch({
          type: c.FEED_STORIES_FETCHED,
          stories: List(resp),
          page,
          per,
        })
      })
  }
}

export function deleteStory(changelogId, storyId) {
  return dispatch => {
    api.delete(`changelogs/${changelogId}/stories/${storyId}`).
      then(() => {
        dispatch({
          type: c.STORY_DELETED,
          storyId: storyId,
        })
        Router.transitionTo("changelog", {changelogId: changelogId})
      })
  }
}

export function edit(changelogId, storyId, fields) {
  return dispatch => {
    dispatch({
      type: c.STORY_EDITING,
    })

    const data = {
      ...fields,
      contributors: ContributorsStore.tokens.map(t => t.string).toJS().join(','),
    }

    api.put(`changelogs/${changelogId}/stories/${storyId}`, data).
      then(resp => {
        const story = addParams(changelogId, resp)
        dispatch({
          type: c.STORY_UPDATED,
          story: story,
          changelogId: changelogId,
        })
        Router.get().transitionTo('story', story.urlParams)
      })
  }
}

export function heart(storyId) {
  return dispatch => {
    api.put(`user/hearts/stories/${storyId}`).then(() => {
      segment.track(c.ANALYTICS_UPVOTE, {
        type: 'post',
        id: storyId,
      })
    })
    dispatch({
      type: c.STORY_HEARTED,
      storyId: storyId,
    })
  }
}

export function unheart(storyId) {
  return dispatch => {
    api.delete(`user/hearts/stories/${storyId}`)
    dispatch({
      type: c.STORY_UNHEARTED,
      storyId: storyId,
    })
  }
}


export function clickHeart(story) {
  if (!story.viewer_has_hearted) {
    heart(story.slug)
  } else {
    unheart(story.slug)
  }
}

export function publish(
  changelogId,
  data,
  shouldTransition = true,
  successCallback = () => {}
) {
  return dispatch => {
    dispatch({
      type: c.STORY_CREATING,
    })

    api.post(`changelogs/${changelogId}/stories`, data).
      then(resp => {
        const story = addParams(changelogId, resp)

        dispatch({
          type: c.STORY_PUBLISHED,
          story: story,
          changelogId: changelogId,
        })

        segment.track(c.ANALYTICS_POST_CREATED, {
          titleLength: story.title.length,
          bodyLength: (story.body && story.body.length) || 0,
        })

        successCallback(story)
        if (shouldTransition) {
          Router.get().transitionTo('story', story.urlParams)
        }
      })
  }
}

export function pin(changelogId, story) {
  return dispatch => {
    dispatch({
      type: c.STORY_PINNED,
      story: story,
    })
    api.put(`changelogs/${changelogId}/stories/${story.slug}/pin`)
  }
}

export function unpin(changelogId, story) {
  return dispatch => {
    dispatch({
      type: c.STORY_UNPINNED,
      story: story,
    })
    api.put(`changelogs/${changelogId}/stories/${story.slug}/unpin`)
  }
}

export function subscribe(storyId) {
  return dispatch => {
    api.put(`user/subscriptions/stories/${storyId}`)
    dispatch({
      type: c.STORY_SUBSCRIBED,
      storyId: storyId,
    })
  }
}

export function unsubscribe(storyId) {
  return dispatch => {
    api.delete(`user/subscriptions/stories/${storyId}`)
    dispatch({
      type: c.STORY_UNSUBSCRIBED,
      storyId: storyId,
    })
  }
}


export function editStory(story) {
  return {
    type: c.STORY_FIELDS_EDIT,
    resp: story,
  }
}

export function fetch(changelogId, storyId) {
  return {
    types: [c.STORY_FETCHING, c.STORY_FETCHED, c.STORY_FETCH_FAILED],
    promise: client => client.get(`changelogs/${changelogId}/stories/${storyId}?include=group`),
  }
}

export function update(changelogId, storyId, params) {
  return {
    types: [c.STORY_UPDATING, c.STORY_FETCHED, c.STORY_UPDATE_FAILED],
    promise: client => client.put(`changelogs/${changelogId}/stories/${storyId}`, params),
  }
}
