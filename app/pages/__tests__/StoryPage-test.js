import {
  STORY_FETCHED
} from '../../constants'
import { createRedux } from 'redux'
import { Provider } from 'redux/react'
import api from '../../lib/api'
import Dispatcher from '../../lib/dispatcher'
import React from 'react/addons'
import Router from '../../lib/router_container'
import StoryPage from '../StoryPage.jsx'
import stubRouterContext from '../../lib/stubRouterContext'

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
        unicode: '👍',
      },
      user: {},
      contributors: [],
    }

    const redux = createRedux({ test: () => 'test' });
    const Subject = stubRouterContext(StoryPage.Component, {
      changelog: changelog,
      story: story
    })
    const c = TestUtils.renderIntoDocument(
      <Provider redux={redux}>
        {() => <Subject ref="subject" />}
      </Provider>
    )

    fetchStory('changelog', story)

    spyOn(window, 'confirm').and.returnValue(true)

    let thenSpy = jasmine.createSpy('thenSpy')
    spyOn(api, 'delete').and.returnValue({then: thenSpy})
    spyOn(Router, 'transitionTo')
    TestUtils.Simulate.click(c.refs.subject.refs.stub.refs.del)

    expect(thenSpy).toHaveBeenCalled()
    expect(api.delete.calls.count()).toEqual(1)
  })
})

function fetchStory(changelogId, story) {
  Dispatcher.dispatch({
    type: STORY_FETCHED,
    story: story,
    changelogId: changelogId
  })
}
