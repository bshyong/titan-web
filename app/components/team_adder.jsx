import Avatar from '../ui/Avatar.jsx'
import Badge from './Badge.jsx'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import MembershipActions from '../actions/MembershipActions'
import moment from 'moment'
import NewChangelogActions from '../actions/new_changelog_actions'
import NewChangelogStore from '../stores/new_changelog_store'
import paramsFor from '../lib/paramsFor'
import PostSetActions from '../actions/PostSetActions'
import React from 'react'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'
import UserPicker from '../components/user_picker.jsx'
import UserPickerActions from '../actions/user_picker_actions'
import { Link } from 'react-router'
import { Range } from 'immutable'


@connectToStores(NewChangelogStore)
export default class TeamAdder extends React.Component {

  static getPropsFromStores(props) {
    return {
      memberships: NewChangelogStore.memberships,
      changelogId: NewChangelogStore.changelog.slug,
      changelog: NewChangelogStore.changelog
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      entryCount: 0
    }
  }

  render() {
    const { memberships, changelog } = this.props

    return (
      <div className="mb2">
        <div>
          <h4>🐛, 🔧, and 🚀 are better with a team.</h4>
          Add teammates to <b>{changelog.name}</b>.  They'll be able to post to the changelog, as well as update its settings.
        </div>
        {memberships.map(m => {
          if (m.is_core) {
            return (
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
            )
          }
        })}
        {this.renderEntry()}
        {this.renderBlankEntries()}
      </div>
    )
  }

  renderBlankEntries() {
    let n = this.state.entryCount
    let m = 3 - n
    if (n > 3 ) {
      m = 0
    }
    return Range(0, m).map(this.renderBlankEntry.bind(this))
  }

  renderBlankEntry() {
    return (
      <div className="px2 py1 visible-hover-wrapper">
        <form className="mb3">
          <input type="text"
                disabled={true}
                 className="field-light full-width"
                 placeholder="Add more team members" />
        </form>
      </div>
    )
  }

  renderEntry() {
    return (
      <div className="px2 py1 visible-hover-wrapper">
        <form onSubmit={this.handleAddMember.bind(this)} className="mb3">
          <input type="text" ref={"emailOrUsername"}
                 className="field-light full-width"
                 placeholder="Add a member by username" />
          {this.renderStatus()}
        </form>
      </div>
    )
  }

  handleAddMember(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.emailOrUsername)
    let text = el.value
    if (text !== "") {
      MembershipActions.update(
        this.props.changelogId,
        text, {
          can_write: true,
          can_view: true,
          is_core: true
        }
      )
      let c = this.state.entryCount + 1
      this.setState({entryCount: NewChangelogStore.memberships.size })
      el.value = ''
    }
  }

  handleRemoveClicked(membership) {
    return (e) => {
      if (confirm(`Are you sure you want to remove @${membership.user.username}?`)) {
        let c = this.state.entryCount - 1
        this.setState({entryCount: c})
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