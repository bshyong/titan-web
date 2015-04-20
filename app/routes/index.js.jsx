import {Route} from 'react-router'
import App from 'components/app.js.jsx'
import Org from 'components/org.js.jsx'
import React from 'react'
import SigninSSO from 'components/signin_sso.js.jsx'

export default (
  <Route handler={App}>
    <Route handler={Org} path='/' name="root" />
    <Route handler={SigninSSO} path='/signin/sso' name="sso" />
  </Route>
)
