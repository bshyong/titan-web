import {List} from 'immutable'
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
      membersOnly: false,
      logoSet: false,
      bannerSet: false,
      nameSet: false,
      taglineSet: false
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
            <h4 className="mt0 mb0 bold">Members only</h4>
            <p className="mb0 gray">
              {
                is_members_only ? "Only members can see this changelog" : "Anybody can see this changelog"
              }
            </p>
          </div>
          <div>
            <Switch switched={is_members_only} onSwitched={this.handleSwitchMembersOnly.bind(this)} />
          </div>
        </div>
        {this.renderNameChanger()}
        {this.renderTaglineChanger()}
        {this.renderLogoChanger()}
        {this.renderBannerChanger()}

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

  renderNameChanger() {
    return (
      <div className="clearfix">
        <label>
          <h4 className="bold mr3">
            Name
          </h4>
        </label>
          <div className="px2 py1 visible-hover-wrapper">
            <form onSubmit={this.handleChangeName.bind(this)} className="mb3">
              <input type="text" ref="name"
                     className="field-light full-width"
                     placeholder={this.props.changelog.name} />
            </form>
            {this.state.nameSet ? <div>name set</div> : <div/>}
          </div>
      </div>
    )
  }

  renderTaglineChanger() {
    return (
      <div className="clearfix">
        <label>
          <h4 className="bold mr3">
            Tagline
          </h4>
        </label>
          <div className="px2 py1 visible-hover-wrapper">
            <form onSubmit={this.handleChangeTagline.bind(this)} className="mb3">
              <input type="text" ref="tagline"
                     className="field-light full-width"
                     placeholder={this.props.changelog.tagline} />
            </form>
            {this.state.taglineSet ? <div>Tagline set</div> : <div/>}
          </div>
      </div>
    )
  }

  renderLogoChanger() {
    return (
      <div className="clearfix py1">
        <label>
          <h4 className="bold mr3">
            Logo
          </h4>
        </label>
          <div className="px2 py1 visible-hover-wrapper">
            <form onSubmit={this.handleAddLogoUrl.bind(this)} className="mb3">
              <input type="text" ref="logo"
                     className="field-light full-width"
                     placeholder={this.props.changelog.logo_url ? this.props.changelog.logo_url : "Logo image url here"} />
            </form>
            {this.state.logoSet ? <div>Logo set</div> : <div/>}
          </div>
      </div>
    )
  }

  renderBannerChanger() {
    return (
      <div className="clearfix py1">
        <label>
          <h4 className="bold mr3">
            Banner
          </h4>
        </label>
          <div className="px2 py1 visible-hover-wrapper">
            <form onSubmit={this.handleAddBannerUrl.bind(this)} className="mb3">
              <input type="text" ref="banner"
                     className="field-light full-width"
                     placeholder={this.props.changelog.banner_url ? this.props.changelog.banner_url : "Banner image URL here"} />
            </form>
            {this.state.bannerSet ? <div>Banner set</div> : <div/>}
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

  handleAddLogoUrl(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.logo)
    let text = el.value
    ChangelogActions.update(this.props.changelogId, {logo_url: text, name: this.props.changelog.name})
    this.setState({logoSet: true})
  }

  handleAddBannerUrl(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.banner)
    let text = el.value
    ChangelogActions.update(this.props.changelogId, {banner_url: text, name: this.props.changelog.name})
    this.setState({bannerSet: true})
  }

  handleChangeTagline(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.tagline)
    let text = el.value
    ChangelogActions.update(this.props.changelogId, {tagline: text, name: this.props.changelog.name})
    this.setState({taglineSet: true})
  }

  handleChangeName(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.refs.name)
    let text = el.value
    ChangelogActions.update(this.props.changelogId, {slug: this.props.changelogId, name: text})
    this.setState({nameSet: true})
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
    ChangelogActions.update(this.props.changelogId, {
      is_members_only: on
    })
  }

  handleDeleteChangelog() {
    if (confirm("Are you 100%, totally sure you want to delete this changelog?")) {
      ChangelogActions.destroy(this.props.changelogId)
    }
  }
}
