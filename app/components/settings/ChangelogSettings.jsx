import authenticated from '../mixins/authenticated_mixin.jsx'
import Avatar from '../../ui/Avatar.jsx'
import Button from '../../ui/Button.jsx'
import ChangelogActions from '../../actions/changelog_actions'
import ChangelogStore from '../../stores/changelog_store'
import CustomDomainSettingsPanel from './CustomDomainSettingsPanel.jsx'
import connectToStores from '../../lib/connectToStores.jsx'
import DropzoneContainer from '../DropzoneContainer.jsx'
import Icon from '../../ui/Icon.jsx'
import LoadingBar from '../../ui/LoadingBar.jsx'
import Logo from '../logo.jsx'
import MembershipActions from '../../actions/MembershipActions'
import ProfileStore from '../../stores/profile_store'
import RadioGroup from 'react-radio-group'
import React from 'react'
import RouterContainer from '../../lib/router_container'
import Switch from '../../ui/Switch.jsx'
import Table from '../../ui/Table.jsx'
import Link from '../../components/Link.jsx'
import {List, Map} from 'immutable'


@authenticated()
@connectToStores(ChangelogStore)
export default class ChangelogSettings extends React.Component {
  static willTransitionTo(transition, params) {
    ChangelogActions.clearCurrent()
    ChangelogActions.select(RouterContainer.changelogSlug(params))
    ChangelogActions.fetchMemberships(RouterContainer.changelogSlug(params))
  }

  static getPropsFromStores(props) {
    const changelogId = RouterContainer.changelogSlug()

    return {
      changelogId,
      changelog: ChangelogStore.changelog,
      coreMemberships: ChangelogStore.coreMemberships,
      errors: ChangelogStore.errors,
      updateSuccessful: ChangelogStore.updateSuccessful
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      bannerUploading: false,
      logoUploading: false,
      saved: false
    }
  }

  componentDidMount() {
    this.onBannerUploaded = this._onBannerUploaded.bind(this)
    this.onBannerUploading = this._onBannerUploading.bind(this)
    this.onLogoUploaded = this._onLogoUploaded.bind(this)
    this.onLogoUploading = this._onLogoUploading.bind(this)
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
          A list of current members who can create new stories.
          Make sure your team <Link to="sso">signs up</Link> so they can participate!
        </p>

        <div>
          {this.props.coreMemberships.map(this.renderMembership.bind(this))}
          <div className="px2 py1 visible-hover-wrapper">
            <form onSubmit={this.handleAddMember.bind(this)} className="mb3">
              <input type="text"
                ref="emailOrUsername"
                className="field-light full-width"
                placeholder="Add a member by username" />
              {this.renderStatus()}
            </form>
          </div>
        </div>

        <div className="flex flex-center py2">
          <div className="flex-auto">
            <h4 className="mt0 bold">Privacy</h4>
            <RadioGroup name="privacy"
              selectedValue={is_members_only ? 'private' : 'public'}
              onChange={this.handleSwitchMembersOnly.bind(this)}>
              {/*
                Note: We're not foregetting to call the function below.
                <RadioGroup> expects a function and calls it for us.
              */}
              {this.renderPrivacyOptions}
            </RadioGroup>
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
        <CustomDomainSettingsPanel />
        <hr />

        <div className="flex flex-center py2">
          <div className="flex-auto">
            <h4 className="mt0 mb0 bold">
              <a href="https://en.wikipedia.org/wiki/Danger,_Will_Robinson"
                className="black">
                Danger, Will Robinson!
              </a>
            </h4>
          </div>
          <div className="mxn1">
            <Button color="red"
              style="transparent"
              size="small"
              action={this.handleDeleteChangelog.bind(this)}>
              Delete changelog
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderBannerChanger() {
    const { changelog } = this.props

    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr1 inline-block">
            Banner
          </h4>
          <span className="gray">Drag and drop or click to change</span>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
          <DropzoneContainer id={`banner-${changelog.id}`}
            clickable="#banner-clickable"
            onUploaded={this.onBannerUploaded}
            onUploading={this.onBannerUploading}>
            <img className="rounded"
              id="banner-clickable"
              src={changelog.banner_url} />
            <LoadingBar loading={this.state.bannerUploading} />
          </DropzoneContainer>
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
            <input type="text"
              ref="homepage"
              className="field-light full-width"
              onChange={this.handleChange('homepage_url')}
              value={this.props.changelog.homepage_url}
              placeholder="https://www.example.com" />
          </form>
        </div>
      </div>
    )
  }

  renderLogoChanger() {
    const { changelog } = this.props

    return (
      <div className="mb3">
        <label>
          <h4 className="bold mr1 inline-block">
            Logo
          </h4>
          <span className="gray">Drag and drop or click to change</span>
        </label>
        <DropzoneContainer id={`logo-${changelog.id}`}
          clickable="#logo-clickable"
          onUploaded={this.onLogoUploaded}
          onUploading={this.onLogoUploading}>
          <div className="flex-auto" id="logo-clickable">
            <div className="relative" style={{maxWidth: 64, width: 64}}>
              <div className="absolute" style={{bottom: 0}}>
                <LoadingBar loading={this.state.logoUploading} />
              </div>
              <Logo changelog={changelog} size={64} />
            </div>
          </div>
        </DropzoneContainer>
      </div>
    )
  }

  renderMembership(m) {
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
            <input type="text"
              ref="name"
              className="field-light full-width"
              onChange={this.handleChange('name')}
              value={this.props.changelog.name} />
          </form>
        </div>
      </div>
    )
  }

  renderPrivacyOptions(Radio) {
    return (
      <div>
        <div>
          <label>
            <Radio value="public" className="ml0" />
            Public <span className="gray">(Anyone with link)</span>
          </label>
        </div>
        <div>
          <label>
            <Radio value="private" className="ml0" />
            Private <span className="gray">(Only invited members)</span>
          </label>
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
            <input type="text"
              ref="tagline"
              className="field-light full-width"
              onChange={this.handleChange('tagline')}
              value={this.props.changelog.tagline} />
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

  handleChange(field) {
    return (e) => {
      ChangelogActions.change(
        Map(this.props.changelog).set(field, e.target.value).toJS()
      )
    }
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

  handleSave(e) {
    e.preventDefault()
    this.setState({
      saved: true
    })
    ChangelogActions.update(this.props.changelogId, ChangelogStore.changelog)
    RouterContainer.get().
      transitionTo('changelog', {changelogId: this.props.changelogId})
  }

  handleSwitchMembersOnly() {
    ChangelogActions.update(this.props.changelogId, {
      is_members_only: !this.props.changelog.is_members_only
    })
  }

  handleDeleteChangelog() {
    if (confirm("Are you 100%, totally sure you want to delete this changelog?")) {
      ChangelogActions.destroy(this.props.changelogId)
    }
  }

  _onBannerUploaded(banner) {
    ChangelogActions.update(
      this.props.changelogId,
      Map(ChangelogStore.changelog).set('banner_url', banner.href).toJS()
    )

    setTimeout(() => {
      this.setState({
        bannerUploading: false
      })
    }, 500)
  }

  _onBannerUploading(bannerArray) {
    this.setState({
      bannerUploading: true
    })
  }

  _onLogoUploaded(logo) {
    ChangelogActions.update(
      this.props.changelogId,
      Map(ChangelogStore.changelog).set('logo_url', logo.href).toJS()
    )

    setTimeout(() => {
      this.setState({
        logoUploading: false
      })
    }, 500)
  }

  _onLogoUploading(logoArray) {
    this.setState({
      logoUploading: true
    })
  }
}
