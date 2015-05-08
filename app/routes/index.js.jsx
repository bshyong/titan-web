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
import StoryForm from 'components/story_form.js.jsx'
import HighlightPicker from 'components/highlight_picker.js.jsx'
import ChangelogLayout from 'components/changelog_layout.js.jsx'
import StoryPage from 'components/story_page.jsx'

export default (
  <Route handler={App}>
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />

    <Route handler={ChangelogLayout} path="/:changelogId">
      <DefaultRoute handler={Changelog} name="changelog" />

      <Route handler={StoryForm} path=":storyId/edit" name="edit" />
      <Route handler={StoryComposer} path="new">
        <DefaultRoute handler={StoryForm} name="new" />
        <Route handler={HighlightPicker} path="highlights/?:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":storyId" name="story" />
    </Route>


    <Redirect from="/" to="changelog" params={{changelogId: 'assembly'}} />

    <NotFoundRoute handler={NotFound} name="not_found" />
  </Route>
)
