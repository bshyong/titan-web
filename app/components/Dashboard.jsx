import React from 'react'
import DashboardStore from '../stores/DashboardStore'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(DashboardStore)
export default class Dashboard extends React.Component {
  static getPropsFromStores(prevProps) {
    return {
      changelogs: DashboardStore.changelogs
    }
  }

  render() {
    const { changelogs } = this.props
    return <div>Dashboard {changelogs.length}</div>
  }
}
