import {
  ADMIN_CHANGELOG_STATS_FETCHED,
  ADMIN_DATA_FETCHED,
  ADMIN_STORIES_FETCHED,
  ADMIN_USERS_DATA_FETCHED,
} from '../../constants'

import adminStore from '../adminStore'

describe('adminStore', () => {
  const initialState = {
    changelogs: [],
    users: [],
    stories: [],
    stats: [],
  }

  describe('ADMIN_CHANGELOG_STATS_FETCHED', () => {
    const action = {
      type: ADMIN_CHANGELOG_STATS_FETCHED,
      stats: [{ stat: 'stat' }],
    }

    it('updates stats', () => {
      expect(adminStore(initialState, action).stats).toEqual([{ stat: 'stat' }])
    })
  })

  describe('ADMIN_DATA_FETCHED', () => {
    const action = {
      type: ADMIN_DATA_FETCHED,
      changelogs: [{ changelog: 'changelog' }],
    }

    it('updates changelogs', () => {
      expect(adminStore(initialState, action).changelogs).
        toEqual([{ changelog: 'changelog' }])
    })
  })

  describe('ADMIN_STORIES_FETCHED', () => {
    const action = {
      type: ADMIN_STORIES_FETCHED,
      stories: [{ story: 'story' }],
    }

    it('updates stories', () => {
      expect(adminStore(initialState, action).stories).
        toEqual([{ story: 'story' }])
    })
  })

  describe('ADMIN_USERS_DATA_FETCHED', () => {
    const action = {
      type: ADMIN_USERS_DATA_FETCHED,
      users: [{ user: 'user' }],
    }

    it('updates users', () => {
      expect(adminStore(initialState, action).users).
        toEqual([{ user: 'user' }])
    })
  })
})
