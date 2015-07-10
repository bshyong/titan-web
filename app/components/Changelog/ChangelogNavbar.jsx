import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import ChangelogStore from 'stores/changelog_store'
import connectToStores from 'lib/connectToStores.jsx'
import FollowButton from 'components/follow_button.jsx'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import Logo from 'components/logo.jsx'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import URL from 'url'
import AppNavbar from 'components/App/AppNavbar.jsx'

@connectToStores(ChangelogStore)
export default class ChangelogNavbar extends React.Component {
  static getPropsFromStores(props) {
    return {
      following: ChangelogStore.following,
      changelog: ChangelogStore.changelog
    }
  }

  static propTypes = {
    size: React.PropTypes.oneOf(['default', 'small']),
  }

  static defaultProps = {
    size: 'default',
  }

  render() {
    const {
      changelog,
      size
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
      <AppNavbar bg="charcoal" bgImgUrl={changelog.banner_url}>
        {content}
      </AppNavbar>
    )
  }

  renderDefault() {
    const { changelog, following } = this.props
    return (
      <div className="changelog-navbar sm-flex flex-center sm-py3 md-py4 mt4 sm-mt2 md-mt0">
        <div className="flex-none mb2 sm-mb0">
          <Link className="block mx-auto" style={{width: '4rem'}} to="changelog" params={paramsFor.changelog(changelog)}>
            <div className="shadow rounded">
              <Logo changelog={changelog} size="4rem"/>
            </div>
          </Link>
        </div>
        <div className="block flex-auto mb2 md-mb0 sm-px3 center sm-left-align white">
          <h2 className="mt0 mb0 bold"><ChangelogName changelog={changelog} /></h2>
          <div>{changelog.tagline}</div>
          {this.renderHomepageUrl()}
        </div>
        <div className="flex-none sm-ml2">
          <div className="sm-flex mxn1">
            <div className="flex mb2 sm-mb0">
              {this.renderNewStoryButton()}
              {this.renderSettingsButton()}
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
    const { changelog, following } = this.props
    return (
      <div className="changelog-navbar sm-flex flex-center md-mt0" style={{height: 'calc(2rem - 2px)'}}>
        <div className="flex-none mb2 sm-mb0">
          <Link className="block mx-auto" style={{width: '2rem'}} to="changelog" params={paramsFor.changelog(changelog)}>
            <div className="shadow rounded">
              <Logo changelog={changelog} size="2rem"/>
            </div>
          </Link>
        </div>
        <div className="block flex-auto mb2 md-mb0 sm-px2 center sm-left-align white">
          <h3 className="mt0 mb0 bold"><ChangelogName changelog={changelog} /></h3>
        </div>
        <div className="flex-none ml2 sm-show">
          <div className="sm-flex mxn1">
            <div className="flex mb2 sm-mb0">
              {this.renderNewStoryButton()}
              {this.renderSettingsButton()}
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
      return
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

  renderSettingsButton() {
    const { changelog } = this.props
    if (!(changelog && changelog.user_is_team_member)) {
      return
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
