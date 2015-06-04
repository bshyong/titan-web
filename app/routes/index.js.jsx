import {
  NotFoundRoute,
  Redirect,
  Route,
  DefaultRoute
} from 'react-router'
import Changelog from '../components/changelog.js.jsx'
import NotFound from '../components/not_found.js.jsx'
import React from 'react'
import SigninSSO from '../components/signin_sso.js.jsx'
import StoryComposer from '../components/story_composer.js.jsx'
import EditStoryForm from '../components/edit_story_form.js.jsx'
import HomePage from '../pages/HomePage.jsx'
import NewStoryPage from '../pages/NewStoryPage.jsx'
import ChangelogPage from '../pages/ChangelogPage.jsx'
import HighlightPicker from '../components/highlight_picker.js.jsx'
import ChangelogLayout from '../components/changelog_layout.js.jsx'
import SingleDateChangelogPage from '../pages/SingleDateChangelogPage.jsx'
import StoryPage from '../components/story_page.jsx'
import ProfilePage from '../components/profile_page.js.jsx'

export default (
  <Route name="root" path="/">
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />

    <Route handler={ProfilePage} name="profile" path="/users/:username" />

    <Route handler={ChangelogLayout} path="/:changelogId">
      <DefaultRoute handler={ChangelogPage} name="changelog" />
      <Route handler={EditStoryForm} path=":storyId/edit" name="edit" />

      <Route handler={StoryComposer} path="new">
        <DefaultRoute handler={NewStoryPage} name="new" />
        <Route handler={HighlightPicker} path="highlights/?:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":year/:month/:day/:storyId" name="story" />
      <Route handler={StoryPage} path=":year/:month/:day/:storyId#:commentId" name="storyWithComment" />
      <Route handler={SingleDateChangelogPage} path="date/:date/:timeInterval" name="changelog_date" />
    </Route>

    <DefaultRoute handler={HomePage} name="home" />
    <NotFoundRoute handler={NotFound} name="not_found" />
  </Route>
)
