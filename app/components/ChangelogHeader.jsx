import ChangelogStore from '../stores/changelog_store'
import FollowButton from './follow_button.jsx'
import Icon from '../ui/Icon.jsx'
import Jumbotron from '../ui/Jumbotron.jsx'
import Logo from './logo.jsx'
import React from 'react'
import connectToStores from '../lib/connectToStores.jsx'
import { Link } from 'react-router'
import URL from 'url'

@connectToStores(ChangelogStore)
export default class ChangelogHeader extends React.Component {
  static getPropsFromStores(props) {
    return {
      following: ChangelogStore.following,
      changelog: ChangelogStore.changelog
    }
  }

  render() {
    const { changelogId, following, changelog } = this.props
    return (
      <Jumbotron bgColor="charcoal" bgImageUrl={changelog.banner_url}>
        <div className="sm-flex flex-center">
          <div className="flex-none mb2 sm-mb0">
            <Link className="block mx-auto" style={{width: '4rem'}} to="changelog" params={{changelogId}}>
              <Logo changelog={changelog} size="4rem"/>
            </Link>
          </div>
          <div className="block flex-auto mb2 md-mb0 sm-px3 center sm-left-align white">
            <h2 className="mt0 mb0 bold">{changelog.name}</h2>
            <div>{changelog.tagline}</div>
            {this.renderHomepageUrl()}
          </div>
          <div className="flex-none sm-ml2">
            <div className="flex mxn1">
              {this.renderNewStoryButton()}
              {this.renderSettingsButton()}
              <div className="flex-none px1">
                <FollowButton changelogId={changelogId} toggled={following}/>
              </div>
            </div>
          </div>
        </div>
      </Jumbotron>
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
        <a className="white" href={changelog.homepage_url} style={{textDecoration: "underline"}}>{host}</a>
      </div>
    )
  }

  renderNewStoryButton() {
    const { changelog } = this.props
    if (!(changelog && changelog.user_is_team_member)) {
      return
    }

    return (
      <div className="flex-none px1">
        <Link className="button button-outline white" to="new" params={{changelogId: changelog.slug}}>
          <Icon icon="pencil" /> Write
        </Link>
      </div>
    )
  }

  renderSettingsButton() {
    const { changelog } = this.props
    if (!(changelog && changelog.user_is_team_member)) {
      return
    }

    return (
      <div className="flex-none px1">
        <Link className="button button-outline white" to="changelog_settings" params={{changelogId: changelog.slug}}>
          <Icon icon="cog" /> Settings
        </Link>
      </div>
    )
  }
}
