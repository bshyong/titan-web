import ChangelogCard from './Changelog/ChangelogCard.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import DashboardStore from '../stores/DashboardStore'
import Link from '../components/Link.jsx'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import StoryFeed from 'components/StoryFeed.jsx'
import Subheader from 'ui/Subheader.jsx'

@connectToStores(DashboardStore)
export default class Dashboard extends React.Component {
  static getPropsFromStores(prevProps) {
    return {
      featured: DashboardStore.featured,
      following: DashboardStore.following,
    }
  }

  static propTypes = {
    featured: React.PropTypes.object,
    following: React.PropTypes.object,
  }

  render() {
    const { featured } = this.props

    return (
      <div>
        <Subheader text="Featured public changelogs" />

        <div className="sm-flex flex-wrap mxn2">
          {featured.map((changelog, i) =>
            <div className="sm-col-4 p2" key={changelog.id + i}>
              <Link to="changelog" params={paramsFor.changelog(changelog)}>
                <ChangelogCard changelog={changelog} />
              </Link>
            </div>
          )}
        </div>

        <Subheader text="Today's Trending Public Posts" />

        <StoryFeed />

        <Subheader text="Changelogs you're following" />
        {this.renderFollowingChangelogs()}
      </div>
    )
  }

  renderFollowingChangelogs() {
    const { following } = this.props

    if (following.length === 0) {
      return
    }

    return (
      <div className="sm-flex flex-wrap mxn2">
        {following.map((changelog, i) =>
          <div className="sm-col-4 p2" key={changelog.id + i}>
            <Link to="changelog" params={paramsFor.changelog(changelog)}>
              <ChangelogCard changelog={changelog} />
            </Link>
          </div>
        )}
      </div>
    )
  }
}
