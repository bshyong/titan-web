/* eslint no-alert:0 */
import {bindActionCreators} from 'redux'
import {connect} from 'redux/react'
import {Map} from 'immutable'
import {resetInvitation} from 'actions/invitationActions'
import * as changelogActions from 'actions/changelogActions'
import * as membershipActions from 'actions/membershipActions'
import authenticated from 'components/mixins/authenticated_mixin.jsx'
import Button from 'ui/Button.jsx'
import ChangelogInviteLink from 'components/Changelog/ChangelogInviteLink.jsx'
import CustomDomainSettingsPanel from 'components/settings/CustomDomainSettingsPanel.jsx'
import DocumentTitle from 'react-document-title'
import DropzoneContainer from 'components/DropzoneContainer.jsx'
import fetchData from 'decorators/fetchData'
import Flair from 'components/Flair.jsx'
import LoadingBar from 'ui/LoadingBar.jsx'
import Logo from 'components/logo.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import TeamAdder from 'components/TeamAdder.jsx'
import UriRegex from 'lib/uri_regex.js'
import VisibilityToggler from 'components/VisibilityToggler.jsx'
import WriteSetting from 'components/settings/WriteSetting.jsx'

export class ChangelogSettingsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bannerUploading: false,
      logoUploading: false,
      saved: false,
    }
  }

  componentDidMount() {
    this.onBannerUploaded = this._onBannerUploaded.bind(this)
    this.onBannerUploading = this._onBannerUploading.bind(this)
    this.onFlairUploaded = this._onFlairUploaded.bind(this)
    this.onFlairUploading = this._onFlairUploading.bind(this)
    this.onLogoUploaded = this._onLogoUploaded.bind(this)
    this.onLogoUploading = this._onLogoUploading.bind(this)
  }

  render() {
    if (!(this.props.coreMemberships && this.props.changelog)) {
      return <div /> // loading
    }

    const { changelog } = this.props

    return (
      <DocumentTitle title={["Settings", changelog.name].join(' · ')}>
        <div>
          <h4 className="mt0 mb0 bold">Members</h4>
          <p className="h5 gray">
            Anyone you add here will be members of your Changelog. They will be able to read, write, and comment on all posts.
          </p>
          <p className="h5 gray mb1">
            Send this private link to anyone you want to invite:
          </p>

          <div className="mb2">
            <ChangelogInviteLink changelog={this.props.changelog} />
            <Button
              style="transparent"
              size="small"
              color="gray"
              action={this.handleResetInvitationLink.bind(this)}
              ref="reset">
              Reset
            </Button>
          </div>

          <TeamAdder memberships={this.props.coreMemberships} changelog={this.props.changelog} changelogId={this.props.changelogId} showBlankEntries={false} />

          <VisibilityToggler changelog={this.props.changelog} onChange={this.handleSwitchMembersOnly.bind(this)} />
          <WriteSetting changelog={this.props.changelog} onChange={this.handleSwitchWriteSetting.bind(this)} />

          <hr />

          {this.renderNameChanger()}
          {this.renderTaglineChanger()}
          {this.renderLogoChanger()}
          {this.renderBannerChanger()}
          {this.renderFlairChanger()}
          {this.renderHomepageChanger()}
          {this.renderWebhookChanger()}
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
      </DocumentTitle>
    )
  }

  renderBanner(changelog) {
    if (changelog.banner_url) {
      return <img className="rounded" src={changelog.banner_url} />
    }

    return (
      <div className="bg-smoke border center rounded py2 pointer">
        Drag and drop here to upload a banner.
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
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
          <DropzoneContainer id={`banner-${changelog.id}`}
            clickable="#banner-clickable"
            onUploaded={this.onBannerUploaded}
            onUploading={this.onBannerUploading}>
            <div className="rounded pointer"
              id="banner-clickable">
              {this.renderBanner(changelog)}
            </div>
            <LoadingBar loading={this.state.bannerUploading} />
          </DropzoneContainer>
        </div>
      </div>
    )
  }

  renderWebhookChanger() {
    const { changelog } = this.props
    const webhookUrl = changelog.webhook_url

    const error = !webhookUrl || UriRegex.test(webhookUrl) ? '' : 'Invalid URL; make sure to include http:// or https://'

    return (
      <div className="mb2">
        <label>
          <h4 className="bold mr3">
            Slack Webhook URL
          </h4>
          <p className="gray">
            <a href="https://my.slack.com/services/new/incoming-webhook/" target="_blank">Set up a webhook on Slack</a> and save it here to get notified when new posts are published.
          </p>
        </label>
        <div className="mr2 py1 visible-hover-wrapper">
          <form className="mb2">
            <input type="text"
              ref="homepage"
              className="field-light full-width"
              onChange={this.handleChange('webhook_url')}
              value={this.props.changelog.webhook_url}
              placeholder="https://hooks.slack.com/services/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" />
            <small className="px1 red">{error}</small>
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
        </label>
        <DropzoneContainer id={`logo-${changelog.id}`}
          clickable="#logo-clickable"
          onUploaded={this.onLogoUploaded}
          onUploading={this.onLogoUploading}>
          <div className="flex-auto pointer" id="logo-clickable">
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

  renderFlairChanger() {
    const { changelog } = this.props

    return (
      <div className="mb3">
        <label>
          <h4 className="bold mr1 inline-block">
            Changelog flair
          </h4>
        </label>
        <DropzoneContainer id={`flair-${changelog.id}`}
          clickable="#flair-clickable"
          onUploaded={this.onFlairUploaded}
          onUploading={this.onFlairUploading}>
          <div className="flex-auto pointer" id="flair-clickable">
            <div className="relative" style={{maxWidth: 64, width: 64}}>
              <div className="absolute" style={{bottom: 0}}>
                <LoadingBar loading={this.state.flairUploading} />
              </div>
              <Flair changelog={changelog} size={64} />
            </div>
          </div>
        </DropzoneContainer>
        <div className="mb2">
          <label>
            <h4 className="bold mr3">
              Changelog flair name
            </h4>
          </label>
          <div className="mr2 py1 visible-hover-wrapper">
            <form className="mb2">
              <input type="text"
                ref="name"
                className="field-light full-width"
                onChange={this.handleChange('flair_name')}
                value={this.props.changelog.flair_name} />
            </form>
          </div>
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
    const el = React.findDOMNode(this.refs.emailOrUsername)
    const text = el.value
    this.props.updateMembership(
      this.props.changelogId,
      text, {
        can_write: true,
        can_view: true,
        is_core: true,
      }
    )
    el.value = ''
  }

  handleChange(field) {
    return (e) => {
      this.props.change(
        Map(this.props.changelog).set(field, e.target.value).toJS()
      )
    }
  }

  handleRemoveClicked(membership) {
    return () => {
      if (confirm(`Are you sure you want to remove @${membership.user.username}?`)) {
        this.props.deleteMembership(
          this.props.changelogId,
          membership.user.username
        )
      }
    }
  }

  handleSave(e) {
    e.preventDefault()
    this.setState({
      saved: true,
    })
    this.props.update(this.props.changelogId, this.props.changelog)
    RouterContainer.get().
      transitionTo('changelog', {changelogId: this.props.changelogId})
  }

  handleSwitchMembersOnly() {
    this.props.update(this.props.changelogId, {
      is_members_only: !this.props.changelog.is_members_only,
    })
  }

  handleSwitchWriteSetting(setting) {
    this.props.update(this.props.changelogId, {
      anyone_can_write: setting === 'anyone',
    })
  }

  handleResetInvitationLink() {
    const { changelog } = this.props
    if (confirm('Are you sure you want to invalidate this link and create a new one?')) {
      this.props.dispatch(resetInvitation(changelog.slug, changelog.invite_hash))
    }
  }

  handleDeleteChangelog() {
    if (confirm("Are you 100%, totally sure you want to delete this changelog?")) {
      this.props.destroy(this.props.changelogId)
    }
  }

  _onBannerUploaded(banner) {
    setTimeout(() => {
      this.props.update(
        this.props.changelogId,
        Map(this.props.changelog).set('banner_url', `${banner.firesize_url}/${banner.href}`).toJS()
      )

      this.setState({
        bannerUploading: false,
      })
    }, 500)
  }

  _onBannerUploading() {
    this.setState({
      bannerUploading: true,
    })
  }

  _onLogoUploaded(logo) {
    setTimeout(() => {
      this.props.update(
        this.props.changelogId,
        Map(this.props.changelog).
          set('logo_url', `${logo.firesize_url}/${logo.href}`).toJS()
      )

      this.setState({
        logoUploading: false,
      })
    }, 500)
  }

  _onLogoUploading() {
    this.setState({
      logoUploading: true,
    })
  }

  _onFlairUploaded(flair) {
    setTimeout(() => {
      this.props.update(
        this.props.changelogId,
        Map(this.props.changelog).
          set('flair_url', `${flair.firesize_url}/${encodeURIComponent(flair.href)}`).toJS()
      )

      this.setState({
        flairUploading: false,
      })
    }, 500)
  }

  _onFlairUploading() {
    this.setState({
      flairUploading: true,
    })
  }
}

@authenticated()
@fetchData(params => {
  return [
    changelogActions.clearCurrent(),
    changelogActions.select(RouterContainer.changelogSlug(params)),
    changelogActions.fetchMemberships(RouterContainer.changelogSlug(params)),
  ]
})
@connect(state => ({
  changelog: state.currentChangelog.changelog,
  coreMemberships: state.memberships.core,
  errors: state.currentChangelog.errors,
  updateSuccessful: state.currentChangelog.updateSuccessful,
  changelogId: RouterContainer.changelogSlug(),
}))
export default class Wrapper extends React.Component {
  render() {
    return <ChangelogSettingsPage {...this.props}
                                  {...bindActionCreators(changelogActions, this.props.dispatch)}
                                  {...bindActionCreators(membershipActions, this.props.dispatch)} />
  }
}
