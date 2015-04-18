import {Route} from 'react-router'
import App from 'components/app.js.jsx'
import Org from 'components/org.js.jsx'
import React from 'react'

export default (
  <Route handler={App}>
    <Route handler={Org} path='/' name="root" />
  </Route>
)
