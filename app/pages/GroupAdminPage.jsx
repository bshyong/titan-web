import AppNavbar from 'components/App/AppNavbar.jsx'
import React from 'react'
import SessionStore from 'stores/session_store'
import Link from 'components/Link.jsx'
import Avatar from 'ui/Avatar.jsx'
import * as GroupAdminActions from 'actions/group_admin_actions'
import LoadingBar from 'ui/LoadingBar.jsx'


export class GroupAdminPage extends React.Component {

  componentDidMount() {
    const { changelogId } = this.props
    this.props.fetchMembers(changelogId)
  }

  render() {
    const { groupMembers } = this.props

    return (
      <div>
        <AppNavbar title="Group admin page" />
        <div className="px4 py2">
          {groupMembers.fetching ? this.renderLoadingState() : this.renderLoadedState()}
          <LoadingBar loading={groupMembers.fetching} />
        </div>
      </div>
    )
  }

  renderLoadingState() {
    return <div>
      <h2 className="bold">Loading member data..</h2>
    </div>
  }

  renderLoadedState() {
    const { groupMembers } = this.props

    return <div>
      <h2 className="bold">{groupMembers.members.size} Followers</h2>
      <GroupMembers {...this.props} />
    </div>
  }
}

export class GroupMembers extends React.Component {

  render() {
    const { members } = this.props.groupMembers

    return <div className="overflow-scroll">
      <table className="table-light overflow-hidden bg-white border rounded">
        <thead className="bg-smoke">
          <tr className="">
            <th className="">User</th>
            <th className="">Email</th>
            <th className="">Twitter</th>
            <th className="">LinkedIn</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => this.renderUserRow(m))}
        </tbody>
      </table>
    </div>
  }

  renderUserRow(user) {
    const { linkedin_info, twitter_info } = user

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
          {{...linkedin_info}.handle ? `https://linkedin.com/${linkedin_info.handle}` : '-'}
        </div>
      </td>
    </tr>
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
