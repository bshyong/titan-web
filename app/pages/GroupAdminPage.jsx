import * as GroupAdminActions from 'actions/group_admin_actions'
import AppNavbar from 'components/App/AppNavbar.jsx'
import Avatar from 'ui/Avatar.jsx'
import Link from 'components/Link.jsx'
import LoadingBar from 'ui/LoadingBar.jsx'
import React from 'react'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import c3 from 'c3'
import moment from 'config/moment'
import Icon from 'ui/Icon.jsx'
import SessionStore from 'stores/session_store'

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
            <h2 className="bold">{groupStats.stats.hearts_count} Hearts</h2>
            <h2 className="bold">{groupStats.stats.views_count} Views</h2>
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
    let d2 = ['x2']
    let d3 = ['x3']
    let n = ['Followers']
    let h = ['Hearts']
    let v = ['Views']
    if (groupStats.stats.followers_history) {
      for (var key in groupStats.stats.followers_history) {
        if (key !== null) {
          d.push(key)
          n.push(groupStats.stats.followers_history[key])
        }
      }

      for (var key in groupStats.stats.hearts_history) {
        if (key !== null) {
          d2.push(key)
          h.push(groupStats.stats.hearts_history[key])
        }
      }

      for (var key in groupStats.stats.views_history) {
        if (key !== null) {
          d3.push(key)
          v.push(groupStats.stats.views_history[key])
        }
      }
      var chart = c3.generate({
        bindto: '#followersChart',
        data: {
          xs: {
              'Followers': 'x',
          },
          columns: [
            d,
            n,
            ],
          type: 'area-spline',
          axes: {
            'Followers': 'y'
          }
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
    const { groupMembers, changelogId } = this.props
    if (groupMembers.members.size == 0) { return null }

    const csvLink = `${API_URL}/changelogs/${changelogId}/admin/members_csv.csv?a=${SessionStore.jwt}`

    return <div>
      <div className="flex flex-end py1">
        <div className="h2">Followers</div>
        <div className="flex-auto"></div>
        <div className="pointer"><a href={csvLink} target="_blank">Download CSV</a></div>
      </div>
      <GroupMembers {...this.props} />
    </div>
  }
}

export class GroupMembers extends React.Component {

  constructor(props) {
    super(props)
    this.fetchMore = this.fetchMore.bind(this)
  }

  render() {
    const { members, moreAvailable, page, per, sort, filter, fetching } = this.props.groupMembers
    const [sortCategory, sortOrder] = this.props.groupMembers.sort.split('-')
    const { fetchMembers, changelogId } = this.props

    return <div>
      <div className="overflow-scroll">
        <table className="table-light bg-white border rounded h5">
          <thead className="bg-smoke">
            <tr className="">
              <th className="">User</th>
              <th className="">Email</th>
              <th className="">Twitter</th>
                <th className="">
                  <SortArrow
                    category="hearts"
                    onClick={sort => fetchMembers(changelogId, 1, per, sort, filter)}
                    activeCategory={sortCategory}
                    direction={sortOrder || 'desc'} />
                  &nbsp;Hearts
                </th>
              <th className="">
                <SortArrow
                  category="contributions"
                  onClick={sort => fetchMembers(changelogId, 1, per, sort, filter)}
                  activeCategory={sortCategory}
                  direction={sortOrder || 'desc'} />
                &nbsp;Contributions
              </th>
              <th className="">
                <SortArrow
                  category="last_contributed_at"
                  onClick={sort => fetchMembers(changelogId, 1, per, sort, filter)}
                  activeCategory={sortCategory}
                  direction={sortOrder || 'desc'} />
                &nbsp;Last Viewed At
              </th>
              <th className="">
                <SortArrow
                  category="joined"
                  onClick={sort => fetchMembers(changelogId, 1, per, sort, filter)}
                  activeCategory={sortCategory}
                  direction={sortOrder || 'desc'} />
                 &nbsp;Joined At
              </th>
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
    const { total_hearts_count, contribution_count, twitter_info, last_contributed_at } = user

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
      <td>
        <div className="py1" style={{wordBreak: 'break-all'}}>
          <a href={`mailto:${user.email}?Subject=Hi`}>
            {user.email}
          </a>
        </div>
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
          {total_hearts_count || 0}
        </div>
      </td>
      <td className="">
        <div className="py1">
          {contribution_count}
        </div>
      </td>
      <td>
        {moment(last_contributed_at).fromNow()}
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

export class SortArrow extends React.Component {
  static propTypes = {
    direction: React.PropTypes.oneOf(['asc', 'desc']),
    category: React.PropTypes.string,
    activeCategory: React.PropTypes.string,
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  render() {
    const { activeCategory, direction, onClick, category } = this.props
    let oppositeDirection, iconClass

    if (category === activeCategory) {
      iconClass = `sort-${direction}`
      oppositeDirection = direction === 'asc' ? 'desc' : 'asc'
    } else {
      iconClass = 'sort'
      oppositeDirection = 'desc'
    }

    return <span onClick={onClick.bind(null, [category, oppositeDirection].join('-'))} className="pointer">
      <Icon icon={iconClass} />
    </span>
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
