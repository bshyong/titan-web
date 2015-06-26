import {
  STORY_FETCHED
} from '../../constants'
import api from '../../lib/api'
import Dispatcher from '../../lib/dispatcher'
import React from 'react/addons'
import Router from '../../lib/router_container'
import StoryPage from '../StoryPage.jsx'
import stubRouterContext from '../../lib/stubRouterContext'

console.log(stubRouterContext)

const TestUtils = React.addons.TestUtils

describe('StoryPage', () => {
  beforeEach(() => {
    spyOn(Router, 'changelogSlug')
  })

  it("deletes story on delete clicked", () => {
    const changelog = {
      viewer_can_edit: true,
    }
    const story = {
      emoji: {
        unicode: '👍'
      },
      user: {},
    }

    const Subject = stubRouterContext(StoryPage.Component, {
      changelog: changelog,
      story: story
    })
    const c = TestUtils.renderIntoDocument(<Subject />)

    fetchStory('changelog', story)

    spyOn(window, 'confirm').and.returnValue(true)
    spyOn(api, 'delete')
    spyOn(Router, 'transitionTo')
    TestUtils.Simulate.click(c.refs.stub.refs.del)

    expect(api.delete.calls.count()).toEqual(1)
    expect(Router.transitionTo.calls.count()).toEqual(1)
  })
})

function fetchStory(changelogId, story) {
  Dispatcher.dispatch({
    type: STORY_FETCHED,
    story: story,
    changelogId: changelogId
  })
}
