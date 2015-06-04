import React from 'react'
import {RouteHandler} from 'react-router'
import ApplicationNavbar from '../components/application_navbar.jsx'

export default class AppPage extends React.Component {
  render() {
    return <div>
      <ApplicationNavbar />
      <RouteHandler />
    </div>
  }
}
