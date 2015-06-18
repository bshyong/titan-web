import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import React from 'react'
import AdminActions from '../actions/admin_actions'
import AdminStore from '../stores/admin_store'
import connectToStores from '../lib/connectToStores.jsx'
import Logo from './logo.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'

@connectToStores(AdminStore)
export default class Admin extends React.Component {
  static getPropsFromStores() {
    return {
      changelogs: AdminStore.changelogs,
      users: AdminStore.users,
      stories: AdminStore.stories
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Admin Page</h1>
        {this.renderTable()}
        <h1>Newest 20 Users</h1>
        {this.renderUsers()}

        <h1>Latest 20 Stories</h1>
        {this.renderStories()}
      </div>
    )
  }

  renderStories() {
    const { stories } = this.props
    if (stories === null) {
      return
    }
    return stories.map(story => {
      console.log(story)
      return (
        <Table.Cell key={story.id} to="story" params={paramsFor.story({slug: story.changelog.slug}, story)} image={<Logo changelog={story.changelog} size="1.5rem" />}>
          <StoryCell story={story} slim={true} />
        </Table.Cell>
      )
    })
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
                <th>Creator</th>
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
    let username = null
    let l = null
    if (changelog.user) {
      username = changelog.user.username
      l = "users/".concat(username)
    } else {
      username = "Mr. E"
      l = "users/awwstn"
    }
    return (
      <tr>
        <td><a href= {changelog.slug}>{changelog.name}</a></td>
        <td>{date}</td>
        <td>{changelog.followers_count}</td>
        <td><a href={l} >{username}</a></td>
      </tr>
    )
  }

  renderUsers() {
    return (
      <table className="table-light">
        <thead>
          <tr>
            <th>Name</th>
            <th>Joined On</th>
          </tr>
        </thead>
        <tbody>
          {this.renderThem()}
        </tbody>
      </table>
    )
  }

  renderThem() {
    if (this.props.users) {
      return List(this.props.users).map(user => {
        let date = moment(user.created_at).format('MMMM D, YYYY')
        let q  = "users/".concat(user.username)
        return (
          <tr>
            <td><a href={q}>{user.username}</a></td>
            <td>{date}</td>
          </tr>
        )
      })
    }
  }
}
