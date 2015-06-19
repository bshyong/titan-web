import Avatar from '../ui/Avatar.jsx'
import Badge from './Badge.jsx'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import Icon from '../ui/Icon.jsx'
import MembershipActions from '../actions/MembershipActions'
import React from 'react'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import { Link } from 'react-router'
import PostSetActions from '../actions/PostSetActions'

export default class TeamAdder extends React.Component {
  static willTransitionTo(transition, params) {
    console.log(this.props.changelogId)
    ChangelogActions.fetchMemberships(this.props.changelogId)
  }

  constructor(props) {
    super(props)
  }

  static getPropsFromStores(props) {
    return {
      coreMemberships: ChangelogStore.coreMemberships,
      changelogId: ChangelogStore.changelog.slug,
      updateSuccessful: ChangelogStore.updateSuccessful,
      errors: ChangelogStore.updateErrors
    }
  }

  render() {
    console.log(this.props.coreMemberships)
    return (
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
              <a className="pointer red" onClick={this.handleRemoveClicked(m)}>
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
    )
  }

  handleAddMember(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.emailOrUsername)
    let text = el.value
    MembershipActions.update(
      this.props.changelogId,
      text, {
        can_write: true,
        can_view: true,
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
            can_view: false,
            can_write: false,
            is_core: false
          }
        )
      }
    }
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



}
