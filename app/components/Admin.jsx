import { connect } from 'redux/react'
import { List } from 'immutable'
import Logo from './logo.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import React, { Component, PropTypes } from 'react'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'

@connect(state => ({
  changelogs: state.adminStore.changelogs,
  stats: state.adminStore.stats,
  stories: state.adminStore.stories,
  users: state.adminStore.users,
}))
export default class Admin extends Component {
  static propTypes = {
    changelogs: PropTypes.array.isRequired,
    stats: PropTypes.array.isRequired,
    stories: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
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
        {this.renderStats()}
      </div>
    )
  }

  renderStories() {
    const { stories } = this.props
    if (!stories) {
      return
    }

    return stories.map((story) => {
      if (story.changelog !== null) {
        return (
          <Table.Cell key={story.id} to="story" params={paramsFor.story({slug: story.changelog.slug}, story)} image={<Logo changelog={story.changelog} size="1.5rem" />}>
            <StoryCell story={story} slim={true} />
          </Table.Cell>
        )
      }
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
      const c = List(this.props.changelogs).sortBy(changelog => changelog.created_at).reverse()
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
    const date = moment(changelog.created_at).format('MMMM D, YYYY')
    let username = null
    let l = null
    if (changelog.user) {
      username = changelog.user.username
      l = 'users/'.concat(username)
    } else {
      username = 'Mr. E'
      l = 'users/awwstn'
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

  renderStats() {
    return (
      <div>
        <h2>Stories Stats</h2>
          <table>
            <thead>
              <th>Week Ending On</th>
              <th>Total Changelogs</th>
              <th>Total Stories</th>
            </thead>
            <tbody>
              {this.renderAllStats()}
            </tbody>
          </table>
      </div>
    )
  }

  renderAllStats() {
    const c = List(this.props.stats)
    return c.map(stat => {
      const date = moment(stat[0]).format('MMMM D, YYYY')
      return (
        <tr>
          <td>{date}</td>
          <td>{stat[1]}</td>
          <td>{stat[2]}</td>
        </tr>
      )
    })
  }

  renderThem() {
    if (this.props.users) {
      return List(this.props.users).map(user => {
        const date = moment(user.created_at).format('MMMM D, YYYY')
        const q  = 'users/'.concat(user.username)
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
