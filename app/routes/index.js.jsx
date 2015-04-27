import { NotFoundRoute, Redirect, Route } from 'react-router'
import App from 'components/app.js.jsx'
import Changelog from 'components/changelog.js.jsx'
import NotFound from 'components/not_found.js.jsx'
import React from 'react'
import SigninSSO from 'components/signin_sso.js.jsx'

export default (
  <Route handler={App}>
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />
    <Route handler={Changelog} path='/:changelogId' name="changelog" />
    <Redirect from="/" to="changelog" params={{changelogId: 'assembly'}} />
    <NotFoundRoute handler={NotFound} name="not_found" />
  </Route>
)
