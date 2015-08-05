import {connect} from 'redux/react'
import AppNavbar from 'components/App/AppNavbar.jsx'
import changelogActions from 'actions/changelogActions'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import FollowButton from 'components/follow_button.jsx'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import Logo from 'components/logo.jsx'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import URL from 'url'

@connect(state => ({
  changelog: state.currentChangelog.changelog,
  user: state.currentUser,
}))
export default class ChangelogNavbar extends React.Component {
  static propTypes = {
    size: React.PropTypes.oneOf(['default', 'small']),
  }

  static defaultProps = {
    size: 'default',
  }

  render() {
    const {
      changelog,
      size,
    } = this.props

    if (!changelog) {
      return <div />
    }

    let content
    switch (size) {
      case 'small':
        content = this.renderSmall()
        break
      default:
        content = this.renderDefault()
    }

    return (
      <AppNavbar bg="charcoal" bgImgUrl={changelog.banner_url} onProduct="yes" size={size}>
        {content}
      </AppNavbar>
    )
  }

  renderDefault() {
    const { changelog } = this.props
    const following = changelog.viewer_is_follower

    return (
      <div className="changelog-navbar md-flex flex-center md-py3 mt4 md-mt2 lg-mt0">
        <div className="flex-none mb2 md-mb0">
          <Link className="block mx-auto" style={{width: '4rem'}} to="changelog" params={paramsFor.changelog(changelog)}>
            <div className="shadow rounded">
              <Logo changelog={changelog} size="4rem"/>
            </div>
          </Link>
        </div>
        <div className="block flex-auto mb2 md-mb0 md-px3 center md-left-align white">
          <h2 className="mt0 mb0 bold"><ChangelogName changelog={changelog} /></h2>
          <div>{changelog.tagline}</div>
          {this.renderHomepageUrl()}
        </div>
        <div className="flex-none md-ml2">
          <div className="md-flex mxn1">
            <div className="flex mb2 md-mb0">
              {this.renderNewStoryButton()}
              {this.renderAdminButton()}
              {this.renderFlagButton()}
            </div>
            <div className="flex-none px1">
              <FollowButton changelogId={changelog.id} toggled={following}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderSmall() {
    const { changelog } = this.props
    const following = changelog.viewer_is_follower

    return (
      <div className="changelog-navbar md-flex flex-center lg-mt0" style={{height: 'calc(2rem - 2px)'}}>
        <div className="flex-auto">
          <Link className="block flex flex-center" to="changelog" params={paramsFor.changelog(changelog)}>
            <div className="flex-none mb2 md-mb0 shadow rounded center mx-auto">
              <Logo changelog={changelog} size="2rem"/>
            </div>
            <div className="block flex-auto ml2 white md-show">
              <h3 className="mt0 mb0 bold"><ChangelogName changelog={changelog} /></h3>
            </div>
          </Link>
        </div>
        <div className="flex-none ml2 md-show">
          <div className="md-flex mxn1">
            <div className="flex mb2 md-mb0">
              {this.renderNewStoryButton()}
              {this.renderAdminButton()}
              {this.renderFlagButton()}
            </div>
            <div className="flex-none px1">
              <FollowButton changelogId={changelog.id} toggled={following}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderHomepageUrl() {
    const { changelog } = this.props
    if (!changelog.homepage_url) {
      return null
    }
    const host = URL.parse(changelog.homepage_url).host
    return (
      <div>
        <a className="white" target="_blank" href={changelog.homepage_url} style={{textDecoration: "underline"}}>{host}</a>
      </div>
    )
  }

  renderNewStoryButton() {
    const { changelog } = this.props
    if (changelog.anyone_can_write || changelog.user_is_team_member) {
      return (
        <div className="flex-auto px1">
          <Link className="button button-outline block full-width center white" to="new" params={paramsFor.changelog(changelog)}>
            <Icon icon="plus" /> Post
          </Link>
        </div>
      )
    }
  }

  renderFlagButton() {
    const { user, changelog } = this.props
    if (user.staff_at !== null) {
      return (
        <div className="flex-auto px1">
          <div className="button button-outline block full-width center white" onClick={changelogActions.flag(changelog.slug)}>
            <Icon icon="flag" /> Flag
          </div>
        </div>
      )
    }
  }

  renderAdminButton() {
    const { changelog } = this.props
    if (!(changelog && changelog.user_is_team_member)) {
      return null
    }

    return (
      <div className="flex-auto px1">
        <Link className="button button-outline block full-width center white" to="groupAdminPage" params={{changelogId: changelog.slug}}>
          <Icon icon="cog" /> Admin
        </Link>
      </div>
    )
  }

  renderSettingsButton() {
    const { changelog } = this.props
    if (!(changelog && changelog.user_is_team_member)) {
      return null
    }

    return (
      <div className="flex-auto px1">
        <Link className="button button-outline block full-width center white" to="changelog_settings" params={{changelogId: changelog.slug}}>
          <Icon icon="cog" /> Settings
        </Link>
      </div>
    )
  }
}
