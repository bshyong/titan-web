import {
  STORY_FETCHED
} from '../../constants'
import { createRedux } from 'redux'
import { Provider } from 'redux/react'
import api from '../../lib/api'
import Dispatcher from '../../lib/dispatcher'
import React from 'react/addons'
import Router from '../../lib/router_container'
import {StoryPage} from '../StoryPage.jsx'
import stubRouterContext from '../../lib/stubRouterContext'

const TestUtils = React.addons.TestUtils

function fetchStory(changelogId, story) {
  Dispatcher.dispatch({
    type: STORY_FETCHED,
    story: story,
    changelogId: changelogId,
  })
}

describe('StoryPage', () => {
  beforeEach(() => {
    spyOn(Router, 'changelogSlug')
  })


  it('deletes story on delete clicked', () => {
    // TBD: add back when reduxed
    // const changelog = {
    //   viewer_can_edit: true,
    //   slug: 'changelog',
    // }
    // const story = {
    //   emoji: {
    //     unicode: '👍',
    //     name: 'thumbsup',
    //   },
    //   user: {},
    //   contributors: [],
    //   created_at: "2015-07-08T21:37:55.814Z",
    //   slug: 'story',
    // }
    //
    // const Subject = stubRouterContext(StoryPage)
    //
    // const dispatcher = () => {}
    // const redux = createRedux(dispatcher, {
    //   currentChangelog: {changelog},
    //   changelogs: {
    //     membered: [],
    //   },
    // })
    // const c = TestUtils.renderIntoDocument(
    //   <Provider redux={redux}>
    //     {() => <Subject ref="subject" changelogId="changelog" story={story} changelog={changelog} />}
    //   </Provider>
    // )
    //
    // fetchStory('changelog', story)
    //
    // spyOn(window, 'confirm').and.returnValue(true)
    //
    // const thenSpy = jasmine.createSpy('thenSpy')
    // spyOn(api, 'delete').and.returnValue({then: thenSpy})
    // spyOn(Router, 'transitionTo')
    // // console.log(Object.keys(c.refs.subject.refs))
    // console.log(Object.keys(c.refs.subject.refs.stub))
    // // console.log(c.refs.subject.refs.stub.refs.del)
    // TestUtils.Simulate.click(c.refs.subject.refs.stub.refs.del)
    //
    // expect(thenSpy).toHaveBeenCalled()
    // expect(api.delete.calls.count()).toEqual(1)
  })
})
