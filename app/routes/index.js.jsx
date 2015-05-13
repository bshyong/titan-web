import {
  NotFoundRoute,
  Redirect,
  Route,
  DefaultRoute
} from 'react-router'
import App from 'components/app.js.jsx'
import Changelog from 'components/changelog.js.jsx'
import NotFound from 'components/not_found.js.jsx'
import React from 'react'
import SigninSSO from 'components/signin_sso.js.jsx'
import StoryComposer from 'components/story_composer.js.jsx'
import EditStoryForm from 'components/edit_story_form.js.jsx'
import NewStoryForm from 'components/new_story_form.js.jsx'
import HighlightPicker from 'components/highlight_picker.js.jsx'
import ChangelogLayout from 'components/changelog_layout.js.jsx'
import StoryPage from 'components/story_page.jsx'
import ProfilePage from 'components/profile_page.js.jsx'

export default (
  <Route handler={App}  name="root" path="/">
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />

    <Route handler={ProfilePage} name="profile" path="/users/:username" />

    <Route handler={ChangelogLayout} path="/:changelogId">
      <DefaultRoute handler={Changelog} name="changelog" />

      <Route handler={EditStoryForm} path=":storyId/edit" name="edit" />

      <Route handler={StoryComposer} path="new">
        <DefaultRoute handler={NewStoryForm} name="new" />
        <Route handler={HighlightPicker} path="highlights/?:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":storyId" name="story" />
    </Route>

    <Redirect from="/" to="changelog" params={{changelogId: 'assembly'}} />

    <NotFoundRoute handler={NotFound} name="not_found" />
  </Route>
)
