import {Redirect, Route} from 'react-router'
import App from 'components/app.js.jsx'
import Org from 'components/org.js.jsx'
import React from 'react'
import SigninSSO from 'components/signin_sso.js.jsx'

export default (
  <Route handler={App}>
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />
    <Route handler={Org} path='/:changelogId' name="changelog" />
    <Redirect from="/" to="changelog" params={{changelogId: 'assembly'}} />
  </Route>
)
