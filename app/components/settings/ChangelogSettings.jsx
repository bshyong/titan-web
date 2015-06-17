import {List} from 'immutable'
import {Link} from 'react-router'
import authenticated from '../mixins/authenticated_mixin.jsx'
import Avatar from '../../ui/Avatar.jsx'
import ChangelogActions from '../../actions/changelog_actions'
import ChangelogStore from '../../stores/changelog_store'
import connectToStores from '../../lib/connectToStores.jsx'
import ProfileStore from '../../stores/profile_store'
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
    ChangelogActions.clearCurrent()
    ChangelogActions.select(params.changelogId)
    ChangelogActions.fetchMemberships(params.changelogId)
  }

  static getPropsFromStores(props) {
    const changelogId = RouterContainer.get().getCurrentParams().changelogId

    return {
      changelogId,
      changelog: ChangelogStore.changelog,
      coreMemberships: ChangelogStore.coreMemberships,
      errors: ChangelogStore.updateErrors,
      updateSuccessful: ChangelogStore.updateSuccessful
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      saved: false
    }
  }

  render() {
    if (!(this.props.coreMemberships && this.props.changelog)) {
      return <div /> // loading
    }

    const {changelog, changelog: { is_members_only }} = this.props
    return (
      <div>
        <h4 className="mt0 mb0 bold">Members</h4>
        <p className="gray">
          Only members can post stories. After your team <Link to="sso">signs up</Link> you'll be able to add them here.
        </p>

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

        <div className="flex flex-center py2">
          <div className="flex-auto">
            <h4 className="mt0 mb0 bold">Public</h4>
          <p className="mb0 gray">
            {
              is_members_only ? "Only members can see this changelog" : "Anybody can see this changelog"
            }
          </p>
          </div>
          <div>
            <Switch switched={!is_members_only} onSwitched={this.handleSwitchMembersOnly.bind(this)} />
          </div>
        </div>

        <hr />

        {this.renderNameChanger()}
        {this.renderTaglineChanger()}
        {this.renderLogoChanger()}
        {this.renderBannerChanger()}
        {this.renderHomepageChanger()}
        {this.renderSaver()}
        <hr />

        <div className="flex flex-center py2">
          <div className="flex-auto">
            <h4 className="mt0 mb0 bold">Do not go gentle into that good night,</h4>
            <p className="mb0 gray">
              Old age should burn and rave at close of day;<br/>
              Rage, rage against the dying of the light.
            </p>
          </div>
          <div className="mxn1">
            <Button color="red" style="transparent" size="small" action={this.handleDeleteChangelog.bind(this)}>Delete changelog</Button>
          </div>
        </div>
      </div>
    )
  }

  renderSaver() {
    return (
      <div>
        <div className="clearfix">
          <form onSubmit={this.handleSave.bind(this)} className="right clearfix">
            <button className="button">Save</button>
          </form>
        </div>
        <div className="clearfix right py1">
          {this.state.saved ? "Saved" : null}
        </div>
      </div>

    )
  }

  handleSave(e) {
    e.preventDefault()
    let elname = React.findDOMNode(this.refs.name)
    let name = elname.value
    let eltagline = React.findDOMNode(this.refs.tagline)
    let tagline = eltagline.value
    let logo = React.findDOMNode(this.refs.logo).value
    let banner = React.findDOMNode(this.refs.banner).value
    this.setState({saved: true})
    ChangelogActions.update(this.props.changelogId, {slug: this.props.changelogId, name: name, tagline: tagline, logo_url: logo, banner_url: banner})
  }

  renderNameChanger() {
    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr3">
            Name
          </h4>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
           <form className="mb2">
             <input type="text" ref="name"
                    className="field-light full-width"
                    defaultValue={this.props.changelog.name} />
           </form>
         </div>
      </div>
    )
  }

  renderHomepageChanger() {
    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr3">
            Home Page URL
          </h4>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
           <form className="mb2">
             <input type="text" ref="homepage"
                    className="field-light full-width"
                    defaultValue={this.props.changelog.homepage_url}
                    placeholder="https://www.example.com" />
           </form>
         </div>
      </div>
    )
  }

  renderTaglineChanger() {
    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr3">
            Tagline
          </h4>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
           <form className="mb2">
             <input type="text" ref="tagline"
                    className="field-light full-width"
                    defaultValue={this.props.changelog.tagline} />
           </form>
         </div>
      </div>
    )
  }

  renderLogoChanger() {
    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr3">
            Logo URL
          </h4>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
           <form className="mb2">
             <input type="text" ref="logo"
                    className="field-light full-width"
                    defaultValue={this.props.changelog.logo_url} />
           </form>
         </div>
      </div>
    )
  }

  renderBannerChanger() {
    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr3">
            Banner URL
          </h4>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
           <form className="mb2">
             <input type="text" ref="banner"
                    className="field-light full-width"
                    defaultValue={this.props.changelog.banner_url} />
           </form>
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

  handleSwitchMembersOnly(on) {
    ChangelogActions.update(this.props.changelogId, {
      is_members_only: !this.props.changelog.is_members_only
    })
  }

  handleDeleteChangelog() {
    if (confirm("Are you 100%, totally sure you want to delete this changelog?")) {
      ChangelogActions.destroy(this.props.changelogId)
    }
  }
}
