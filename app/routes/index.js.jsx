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
import Playground from 'components/playground.js.jsx'
import HighlightPicker from 'components/highlight_picker.js.jsx'

export default (
  <Route handler={App}>
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />

    <Route path='/:changelogId'>
      <Route handler={StoryComposer} path='new'>
        <Route path='highlights' handler={HighlightPicker} name="highlights" />
        <DefaultRoute handler={Playground} name="new" />
      </Route>

      <DefaultRoute handler={Changelog} name="changelog" />
    </Route>

    <Redirect from="/" to="changelog" params={{changelogId: 'assembly'}} />

    <NotFoundRoute handler={NotFound} name="not_found" />
  </Route>
)
