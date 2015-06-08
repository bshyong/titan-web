import authenticated from '../mixins/authenticated_mixin.jsx'
import ChangelogActions from '../../actions/changelog_actions'
import ChangelogStore from '../../stores/changelog_store'
import connectToStores from '../../lib/connectToStores.jsx'
import MembershipActions from '../../actions/MembershipActions'
import React from 'react'

@authenticated()
@connectToStores(ChangelogStore)
export default class ChangelogSettings extends React.Component {
  static willTransitionTo(transition, params) {
    ChangelogActions.fetchMemberships(params.changelogId)
  }

  static getPropsFromStores(props) {
    return {
      memberships: ChangelogStore.memberships
    }
  }

  render() {
    if (!this.props.memberships) {
      return <div /> // loading
    }
    return (
      <div>
        <h2>Changelog Settings</h2>

        <div className="overflow-scroll">
          <table className="table-light">
            <thead>
              <tr>
                <th></th>
                <th>Core Team</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderRows() {
    return this.props.memberships.map(this.renderRow.bind(this))
  }

  renderRow(membership) {
    return (
      <tr key={membership.id}>
        <td>{membership.user.username}</td>
        <td>
          <input type="checkbox"
                 checked={membership.is_core}
                 onChange={this.handleChange(membership).bind(this)} />
        </td>
      </tr>
    )
  }

  handleChange(membership) {
    return (e) => {
      MembershipActions.update(
        this.props.params.changelogId,
        membership.user.username,
        { is_core: e.target.checked }
      )
    }
  }
}
