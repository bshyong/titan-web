import React from 'react'
import ChangelogActions from '../actions/changelog_actions'
import Dashboard from '../components/Dashboard.jsx'

export default class DashboardPage extends React.Component {

  static willTransitionTo(transition, params, query) {
    ChangelogActions.fetchAll()
  }

  render() {
    return <div className="container">
      <Dashboard />
    </div>
  }
}
