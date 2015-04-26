<<<<<<< HEAD
import { NotFoundRoute, Redirect, Route } from 'react-router'
=======
import {Redirect, Route, DefaultRoute} from 'react-router'
>>>>>>> WIP.
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
    <Route handler={Changelog} path='/:changelogId' name="changelog" />

    <Route handler={StoryComposer} path='/new'>
      <Route path='/highlights' handler={HighlightPicker} name="highlights" />
      <DefaultRoute handler={Playground} name="new" />
    </Route>

    <Redirect from="/" to="changelog" params={{changelogId: 'assembly'}} />
    <NotFoundRoute handler={NotFound} name="not_found" />
  </Route>
)
