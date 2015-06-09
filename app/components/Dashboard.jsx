import React from 'react'
import DashboardStore from '../stores/DashboardStore'
import connectToStores from '../lib/connectToStores.jsx'
import {Link} from 'react-router'
import ChangelogCard from './Changelog/ChangelogCard.jsx'
import Button from '../ui/Button.jsx'
import Jumbotron from '../ui/Jumbotron.jsx'

// --

@connectToStores(DashboardStore)
export default class Dashboard extends React.Component {
  static getPropsFromStores(prevProps) {
    return {
      featured: DashboardStore.featured,
      following: DashboardStore.following,
    }
  }

  render() {
    const { featured, following } = this.props

    return (
      <div>
        {this.renderFollowingChangelogs()}

        <div className="mb3">
          <h4 className="mt0 mb0 py2 caps center border-bottom gray">Featured public changelogs</h4>

          <div className="sm-flex flex-wrap mxn2">
            {featured.map((changelog, i) =>
              <div className="sm-col-4 p2" key={changelog.id + i}>
                <Link to="changelog" params={{changelogId: changelog.slug}}>
                  <ChangelogCard changelog={changelog} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderFollowingChangelogs() {
    const { following } = this.props

    if (following.length === 0) {
      return
    }

    return (
      <div className="mb3">
        <h4 className="mt0 mb0 py2 caps center border-bottom gray">Changelogs you're following</h4>

        <div className="sm-flex flex-wrap mxn2">
          {following.map((changelog, i) =>
            <div className="sm-col-4 p2" key={changelog.id + i}>
              <Link to="changelog" params={{changelogId: changelog.slug}}>
                <ChangelogCard changelog={changelog} />
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }
}
