import authenticated from '../mixins/authenticated_mixin.jsx'
import Avatar from '../../ui/Avatar.jsx'
import ChangelogActions from '../../actions/changelog_actions'
import ChangelogStore from '../../stores/changelog_store'
import connectToStores from '../../lib/connectToStores.jsx'
import MembershipActions from '../../actions/MembershipActions'
import React from 'react'
import RouterContainer from '../../lib/router_container'
import Table from '../../ui/Table.jsx'
import UserCell from '../User/UserCell.jsx'


@authenticated()
@connectToStores(ChangelogStore)
export default class ChangelogSettings extends React.Component {
  static willTransitionTo(transition, params) {
    ChangelogActions.fetchMemberships(params.changelogId)
  }

  static getPropsFromStores(props) {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId,
      coreMemberships: ChangelogStore.coreMemberships,
      errors: ChangelogStore.updateErrors,
      updateSuccessful: ChangelogStore.updateSuccessful
    }
  }

  render() {
    if (!this.props.coreMemberships) {
      return <div /> // loading
    }
    return (
      <div>
        <h2 className="border-bottom border-smoke">Core Team</h2>

        <Table>
          {this.props.coreMemberships.map(m => (
            <Table.Cell key={m.id} image={<Avatar user={m.user} size={24} />}>
              <a className="right pointer" onClick={this.handleRemoveClicked(m)}>x</a>
              {m.user.username}
            </Table.Cell>
          ))}
        </Table>
        <form onSubmit={this.handleAddMember.bind(this)}>
          <input type="text" ref="emailOrUsername"
                 className="field-light full-width"
                 placeholder="Add core team member by username" />
        </form>
        {this.renderStatus()}

        <h2 className="mt4 border-bottom border-smoke">Followers</h2>
        <p>This is a <strong>public</strong> changelog. Anybody can find and follow it.</p>
      </div>
    )
  }

  renderStatus() {
    if (this.props.updateSuccessful) {
      return <span className="ml1 green">Update successful</span>
    }
    if (this.props.updateSuccessful === false) {
      if (this.props.errors.user && this.props.errors.user.join().indexOf('blank') !== -1) {
        return <span className="ml1 red">Unknown user</span>
      }
      return <span className="ml1 red">Update failed</span>
    }
    return null
  }

  handleAddMember(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.emailOrUsername)
    let text = el.value
    // if (text.match(/.+@.+/)) {
    //   MembershipActions.invite(this.props.params.changelogId, text)
    // } else {
      MembershipActions.update(
        this.props.changelogId,
        text, {
          is_core: true
        }
      )
    // }

    el.value = ''
  }

  handleRemoveClicked(membership) {
    return (e) => {
      MembershipActions.update(
        this.props.changelogId,
        membership.user.username, {
          is_core: false
        }
      )
    }
  }
}
