import authenticated from '../mixins/authenticated_mixin.jsx'
import Avatar from '../../ui/Avatar.jsx'
import ChangelogActions from '../../actions/changelog_actions'
import ChangelogStore from '../../stores/changelog_store'
import connectToStores from '../../lib/connectToStores.jsx'
import MembershipActions from '../../actions/MembershipActions'
import React from 'react'
import RouterContainer from '../../lib/router_container'
import Table from '../../ui/Table.jsx'
import Icon from '../../ui/Icon.jsx'
import Switch from '../../ui/Switch.jsx'
import Button from '../../ui/Button.jsx'


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

  constructor(props) {
    super(props)
    this.state = {
      membersOnly: false
    }
  }

  render() {
    if (!this.props.coreMemberships) {
      return <div /> // loading
    }
    return (
      <div>
        <h4 className="mt0 mb0 bold">Members</h4>
        <p className="gray">Members can post stories</p>

        <div className="mb2">
          {this.props.coreMemberships.map(m => (
            <div className="flex flex-center px2 py1 bg-smoke-hover visible-hover-wrapper" key={m.id}>
              <div>
                <Avatar user={m.user} size={16 * 2} />
              </div>
              <div className="flex-auto px2">
                {m.user.username}
              </div>
              <div className="visible-hover">
                <a className="pointer" onClick={this.handleRemoveClicked(m)}>
                  <Icon icon="trash-o" />
                </a>
              </div>
            </div>
          ))}
          <div className="px2 py1 visible-hover-wrapper">
            <form onSubmit={this.handleAddMember.bind(this)} className="mb3">
              <input type="text" ref="emailOrUsername"
                     className="field-light full-width"
                     placeholder="Add a member by username" />
              {this.renderStatus()}
            </form>
          </div>
        </div>

        <hr />

        <div className="flex flex-center py2">
          <div className="flex-auto">
            <h4 className="mt0 mb0 bold">Members only</h4>
            <p className="mb0 gray">
              {
                this.state.membersOnly ? "Only members can see this changelog" : "Anybody can see this changelog"
              }
            </p>
          </div>
          <div>
            <Switch switched={this.state.membersOnly} onSwitched={this.handleSwitchMembersOnly.bind(this)} />
          </div>
        </div>

        <hr />

        <div className="py2 mxn1">
          <Button color="red" style="transparent" size="small">Destroy changelog</Button>
        </div>

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
    MembershipActions.update(
      this.props.changelogId,
      text, {
        is_core: true
      }
    )
    el.value = ''
  }

  handleRemoveClicked(membership) {
    return (e) => {
      if (confirm(`Are you sure you want to remove @${membership.user.username}?`)) {
        MembershipActions.update(
          this.props.changelogId,
          membership.user.username, {
            is_core: false
          }
        )
      }
    }
  }

  handleSwitchMembersOnly(on) {
    this.setState({membersOnly: on})
  }
}
