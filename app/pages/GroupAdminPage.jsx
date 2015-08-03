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
import ordinalNumber from 'lib/ordinalNumberString'

export class GroupAdminPage extends React.Component {

  componentDidMount() {
    moment.locale('admin')
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
          <div className="py2 h2 bold">
            <div className="clearfix">
              <div className="col col-4 center px2">
                <div className="border py2">
                  <div className="h1 gray">
                    <Icon icon="heart" />
                  </div>
                  <div className="sm-h00 h1" style={{fontWeight: 400}}>
                    {groupStats.stats.hearts_count}
                  </div>
                  <div className="h5 gray">
                    hearts
                  </div>
                </div>
              </div>
              <div className="col col-4 center px2">
                <div className="border py2">
                  <div className="h1 gray">
                    <Icon icon="eye" />
                  </div>
                  <div className="sm-h00 h1" style={{fontWeight: 400}}>
                    {groupStats.stats.views_count}
                  </div>
                  <div className="h5 gray">
                    views
                  </div>
                </div>
              </div>
              <div className="col col-4 center px2">
                <div className="border py2">
                  <div className="h1 gray">
                    <Icon icon="user" />
                  </div>
                  <div className="sm-h00 h1" style={{fontWeight: 400}}>
                    {groupStats.stats.followers_count}
                  </div>
                  <div className="h5 gray">
                    members
                  </div>
                </div>
              </div>
            </div>
            <div className="px2 mt2">
              {this.followersChart(groupStats)}
            </div>
          </div>

          <div className="py2">
            {this.renderLoadedState()}
            {groupMembers.fetching || groupStats.fetching ? this.renderLoadingState() : null}
            <LoadingBar loading={groupMembers.fetching || groupStats.fetching} />
          </div>
        </div>
      </div>
    )
  }

  followersChart(groupStats) {
    const d = ['x']
    const d2 = ['x2']
    const d3 = ['x3']
    const n = ['Followers']
    const h = ['Hearts']
    const v = ['Views']

    if (groupStats.stats.followers_history) {
      for (const key in groupStats.stats.followers_history) {
        if (key !== null) {
          d.push(key)
          n.push(groupStats.stats.followers_history[key])
        }
      }

      for (const key in groupStats.stats.hearts_history) {
        if (key !== null) {
          d2.push(key)
          h.push(groupStats.stats.hearts_history[key])
        }
      }

      for (const key in groupStats.stats.views_history) {
        if (key !== null) {
          d3.push(key)
          v.push(groupStats.stats.views_history[key])
        }
      }

      c3.generate({
        bindto: '#followersChart',
        data: {
          xs: { 'Followers': 'x' },
          columns: [ d, n ],
          type: 'area-spline',
          axes: { 'Followers': 'y' },
        },
        axis: {
          x: { type: 'timeseries' },
         },
      })
    }

    return (
      <div id="followersChart" />
    )
  }

  renderLoadingState() {
    return <div>
      <h5 className="bold">Loading data..</h5>
    </div>
  }

  renderLoadedState() {
    const { groupMembers, changelogId } = this.props
    if (groupMembers.members.size === 0) { return null }

    const csvLink = `${API_URL}/changelogs/${changelogId}/admin/members_csv.csv?a=${SessionStore.jwt}`


    return <div>
      <div className="flex flex-end py1">
        <div className="h2">Followers</div>
          <div className="flex-auto"></div>
          <Link to="changelog_settings" params={{changelogId: changelogId}}>
            <div className="pointer">Members & Settings</div>
          </Link>
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
    const { members, moreAvailable, page, per, sort, filter } = this.props.groupMembers
    const [sortCategory, sortOrder] = sort.split('-')
    const { fetchMembers, changelogId } = this.props

    return <div>
      <div className="overflow-scroll">
        <table className="table-light bg-white border rounded h5">
          <thead className="bg-charcoal white">
            <tr className="">
              <SortableHeader
                onClick={newSort => fetchMembers(changelogId, 1, per, newSort, filter)}
                category="username"
                activeCategory={sortCategory}
                direction={sortOrder || 'desc'}>
                Member
              </SortableHeader>
              <SortableHeader
                onClick={newSort => fetchMembers(changelogId, 1, per, newSort, filter)}
                category="hearts"
                activeCategory={sortCategory}
                direction={sortOrder || 'desc'}>
                <Icon icon="heart" /> Earned
              </SortableHeader>
              <SortableHeader
                onClick={newSort => fetchMembers(changelogId, 1, per, newSort, filter)}
                category="rank"
                activeCategory={sortCategory}
                direction={sortOrder || 'desc'}>
                Rank #
              </SortableHeader>
              <SortableHeader
                onClick={newSort => fetchMembers(changelogId, 1, per, newSort, filter)}
                category="last_activity"
                activeCategory={sortCategory}
                direction={sortOrder || 'desc'}>
                Last Active
              </SortableHeader>
              <SortableHeader
                onClick={newSort => fetchMembers(changelogId, 1, per, newSort, filter)}
                category="joined"
                activeCategory={sortCategory}
                direction={sortOrder || 'desc'}>
                Joined
              </SortableHeader>
              <th className=""></th>
              <th className=""></th>
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
    const { total_hearts_count, contribution_rank, twitter_info, last_contributed_at } = user

    return <tr key={user.id}>
      <td className="py1">
        <Link to="profile"
          params={{userId: user.username}}>
          <div className="flex flex-center">
            <div className="flex-none"><Avatar user={user} size={32} /></div>
            <div className="px1 black">{user.username}</div>
          </div>
        </Link>
      </td>
      <td className="py1">
        <div className="py1">
          {total_hearts_count || 0}
        </div>
      </td>
      <td className="py1">
        <div className="py1">
          {ordinalNumber(contribution_rank) || 0}
        </div>
      </td>
      <td className="py1">
        <div className="py1">
          {last_contributed_at ? moment(last_contributed_at).fromNow() : '-'}
        </div>
      </td>
      <td className="py1">
        <div className="py1">
          {moment(user.joined_at).format('ll')}
        </div>
      </td>
      <td>
        <div className="py1 center">
          {{...twitter_info}.handle ?
            <span>
              <Link to={`https://twitter.com/${twitter_info.handle}`}>
                <Icon icon="twitter gray" />
              </Link>
            </span> : '-'}
        </div>
      </td>
      <td>
        <div className="py1" style={{wordBreak: 'break-all'}}>
          <a href={`mailto:${user.email}?Subject=Hi`}>
            <Icon icon="envelope-o fw gray" />
          </a>
        </div>
      </td>
    </tr>
  }

  fetchMore() {
    const { changelogId } = this.props
    const { page, per, sort, filter } = this.props.groupMembers

    this.props.fetchMembers(changelogId, page + 1, per, sort, filter)
  }
}

export class SortableHeader extends React.Component {
  static propTypes = {
    direction: React.PropTypes.oneOf(['asc', 'desc']),
    category: React.PropTypes.string,
    activeCategory: React.PropTypes.string,
    onClick: React.PropTypes.func,
  }

  static defaultProps = {
    onClick: () => {},
  }

  render() {
    const { activeCategory, direction, onClick, category, children } = this.props
    let oppositeDirection
    let iconClass

    if (category === activeCategory) {
      iconClass = `sort-${direction} blue`
      oppositeDirection = direction === 'asc' ? 'desc' : 'asc'
    } else {
      iconClass = 'sort'
      oppositeDirection = 'desc'
    }

    return <th
      className="py2 bg-black-hover pointer"
      onClick={onClick.bind(null, [category, oppositeDirection].join('-'))}>
      {children}
      <span className="pointer px1">
        <Icon icon={iconClass} />
      </span>
    </th>
  }
}

import {connect} from 'redux/react'
import {bindActionCreators} from 'redux'

@connect(state => {
  return {
    ...state,
    groupMembers: {
      ...state.groupMembers,
    },
  }
})
export default class GroupAdminPageWrapper extends React.Component {
  render() {
    return <GroupAdminPage {...this.props}
      {...bindActionCreators(GroupAdminActions, this.props.dispatch)} />
  }
}
