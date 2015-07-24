import * as GroupAdminActions from 'actions/group_admin_actions'
import AppNavbar from 'components/App/AppNavbar.jsx'
import Avatar from 'ui/Avatar.jsx'
import Link from 'components/Link.jsx'
import LoadingBar from 'ui/LoadingBar.jsx'
import React from 'react'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import c3 from 'c3'
import moment from 'config/moment'

export class GroupAdminPage extends React.Component {

  componentDidMount() {
    const { changelogId } = this.props
    const { page, per, sort, filter } = this.props.groupMembers
    this.props.fetchMembers(changelogId, page, per, sort, filter)
    this.props.fetchStats(changelogId)
  }

  render() {
    const { groupMembers, groupStats } = this.props

    return (
      <div>
        <AppNavbar title="Group admin page" />
        <div className="container">

          <div className="py2">
            <h2 className="bold">{groupStats.stats.followers_count} Followers</h2>
            {this.followersChart(groupStats)}
          </div>

          <div className="py2">
            {this.renderLoadedState()}
            {groupMembers.fetching || groupStats.fetching ? this.renderLoadingState() : null}
            <LoadingBar loading={groupMembers.fetching} />
          </div>
        </div>
      </div>

    )
  }

  followersChart(groupStats) {
    let d = ['x']
    let n = ['Followers']
    if (groupStats.stats.followers_history) {
      for (var key in groupStats.stats.followers_history) {
        if (key !== null) {
          d.push(key)
          n.push(groupStats.stats.followers_history[key])
        }
      }
      var chart = c3.generate({
        bindto: '#followersChart',
        data: {
          x: 'x',
          columns: [
            d,
            n
            ],
          type: 'area-spline'
        },
        axis: {
          x: {
           type: 'timeseries'
           }
          }
      });

    }
    return (
      <div id="followersChart">
      </div>
    )
  }

  renderLoadingState() {
    return <div>
      <h5 className="bold">Loading data..</h5>
    </div>
  }

  renderLoadedState() {
    const { groupMembers } = this.props
    if (groupMembers.members.size == 0) { return null }

    return <div>
      <h2>Followers</h2>
      <GroupMembers {...this.props} />
    </div>
  }
}

export class GroupMembers extends React.Component {

  constructor(props) {
    super(props)
    this.fetchMore = ::this.fetchMore
  }

  render() {
    const { members, moreAvailable, page } = this.props.groupMembers

    return <div>
      <div className="overflow-scroll">
        <table className="table-light bg-white border rounded h5">
          <thead className="bg-smoke">
            <tr className="">
              <th className="">User</th>
              <th className="">Email</th>
              <th className="">Twitter</th>
              <th className="">Contributions</th>
              <th className="">Last Activity</th>
              <th className="">Joined At</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => this.renderUserRow(m))}
          </tbody>
        </table>
      </div>
      {moreAvailable ? <ScrollPaginator page={page} onScrollBottom={this.fetchMore} /> : null}
    </div>
  }

  renderUserRow(user) {
    const { contributions, twitter_info } = user

    return <tr key={user.id}>
      <td className="">
        <Link to="profile"
          params={{userId: user.username}}>
          <div className="flex flex-center">
            <div className="flex-none"><Avatar user={user} size={32} /></div>
            <div className="px1">@{user.username}</div>
          </div>
        </Link>
      </td>
      <td className="">
        <div className="py1">{user.email}</div>
      </td>
      <td className="">
        <div className="py1">
          {{...twitter_info}.handle ?
            <span>
              <Link to={`https://twitter.com/${twitter_info.handle}`}>
                {`@${twitter_info.handle}`}
              </Link>
            </span> : '-'}
        </div>
      </td>
      <td className="">
        <div className="py1">
          {`${contributions.stories} stories, ${contributions.comments} comments, ${contributions.hearts} hearts`}
        </div>
      </td>
      <td>
        last contributed at
      </td>
      <td>
        {moment(user.joined_at).fromNow()}
      </td>
    </tr>
  }

  fetchMore() {
    const { changelogId } = this.props
    const { page, per, sort, filter } = this.props.groupMembers

    this.props.fetchMembers(changelogId, page + 1, per, sort, filter)
  }
}

import {connect} from 'redux/react'
import {bindActionCreators} from 'redux'

@connect(state => {
  return {
    ...state,
    groupMembers: {
      ...state.groupMembers
    }
  }
})

export default class GroupAdminPageWrapper extends React.Component {
  render() {
    return <GroupAdminPage {...this.props}
      {...bindActionCreators(GroupAdminActions, this.props.dispatch)} />
  }
}
