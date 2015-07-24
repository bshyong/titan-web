import * as GroupAdminActions from 'actions/group_admin_actions'
import AppNavbar from 'components/App/AppNavbar.jsx'
import Avatar from 'ui/Avatar.jsx'
import Link from 'components/Link.jsx'
import LoadingBar from 'ui/LoadingBar.jsx'
import React from 'react'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import SessionStore from 'stores/session_store'

export class GroupAdminPage extends React.Component {

  componentDidMount() {
    const { changelogId } = this.props
    const { page, per } = this.props.groupMembers
    this.props.fetchMembers(changelogId, page, per)
  }

  render() {
    const { groupMembers } = this.props

    return (
      <div>
        <AppNavbar title="Group admin page" />
        <div className="px4 py2">
          {this.renderLoadedState()}
          {groupMembers.fetching ? this.renderLoadingState() : null}
          <LoadingBar loading={groupMembers.fetching} />
        </div>
      </div>
    )
  }

  renderLoadingState() {
    return <div>
      <h5 className="bold">Loading member data..</h5>
    </div>
  }

  renderLoadedState() {
    const { groupMembers } = this.props
    if (groupMembers.members.size == 0) { return null }

    return <div>
      <h2 className="bold">{groupMembers.members.size} Followers</h2>
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
        <table className="table-light overflow-hidden bg-white border rounded">
          <thead className="bg-smoke">
            <tr className="">
              <th className="">User</th>
              <th className="">Email</th>
              <th className="">Twitter</th>
              <th className="">Contributions</th>
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
          <div className="flex flex-center p1">
            <div><Avatar user={user} size={32} /></div>
            <div className="px1">@{user.username}</div>
          </div>
        </Link>
      </td>
      <td className="">
        <div className="py1">{user.email}</div>
      </td>
      <td className="">
        <div className="py1 h5">
          {{...twitter_info}.handle ?
            <span>
              <Link to={`https://twitter.com/${twitter_info.handle}`}>
                {`@${twitter_info.handle}`}
              </Link>, {{...twitter_info}.followers} followers
            </span> : '-'}
        </div>
      </td>
      <td className="">
        <div className="py1 h5">
          {`${contributions.stories} stories, ${contributions.comments} comments, ${contributions.hearts} hearts`}
        </div>
      </td>
    </tr>
  }

  fetchMore() {
    const { changelogId } = this.props
    const { page, per } = this.props.groupMembers

    this.props.fetchMembers(changelogId, page + 1, per)
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
