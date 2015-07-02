import {
  STORY_FETCHED
} from 'constants'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'
import React from 'react/addons'
import Router from 'lib/router_container'
import NewChangelogPage from '../NewChangelogPage.jsx'
import stubRouterContext from 'lib/stubRouterContext'

const TestUtils = React.addons.TestUtils

describe('NewChangelogPage', () => {
  it("creates the story when next clicked", () => {
    // const changelog = {
    //   name: 'Assembly',
    //   slug: 'assembly',
    // }
    //
    // spyOn(Router, 'transitionTo')
    //
    // const Subject = stubRouterContext(NewChangelogPage.Component)
    // const page = TestUtils.renderIntoDocument(<Subject />).refs.stub
    // const form = page.refs.form.refs.component
    //
    // TestUtils.Simulate.change(form.refs.name, {target: {value: changelog.name}})
    // TestUtils.Simulate.change(form.refs.slug, {target: {value: changelog.slug}})
    // TestUtils.Simulate.click(page.refs.nextButton)
    //
    // spyOn(api, 'transitionTo')
    //
    // expect(Router.transitionTo).toHaveBeenCalledWith(
    //   'inviteChangelogMembers', {changelogId: changelog.slug}
    // )
  })
})
