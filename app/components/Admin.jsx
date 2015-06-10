import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import React from 'react'
import AdminActions from '../actions/admin_actions'
import AdminStore from '../stores/admin_store'
import connectToStores from '../lib/connectToStores.jsx'
import moment from 'moment'

@connectToStores(AdminStore)
export default class Admin extends React.Component {
  static getPropsFromStores() {
    return {
      changelogs: AdminStore.changelogs
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Admin Page</h1>
        {this.renderTable()}
      </div>
    )
  }

  renderTable() {
    if (this.props.changelogs) {
      return (
        <div>
          <h2>Changelogs</h2>
          <table className="table-light">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created On</th>
                <th>Followers</th>
              </tr>
            </thead>
            <tbody>
              {this.renderChangelogs()}
            </tbody>
          </table>
        </div>
      )
    }
  }

  renderChangelogs() {
    if (this.props.changelogs) {
      let c = List(this.props.changelogs).sortBy(changelog => changelog.created_at).reverse()
      return c.map(changelog => {
        return (
          <tr>
            {this.renderChangelog(changelog)}
          </tr>
        )
      })
    }
  }

  renderChangelog(changelog) {
    let date = moment(changelog.created_at).format('MMMM D, YYYY')
    return (
      <tr>
        <th><a href= {changelog.slug}>{changelog.name}</a></th>
        <th>{date}</th>
        <th>{changelog.followers_count}</th>
      </tr>
    )
  }

}
