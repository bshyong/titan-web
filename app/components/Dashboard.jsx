import {fetchFollowing} from 'actions/changelogActions'
import ChangelogCard from './Changelog/ChangelogCard.jsx'
import Link from '../components/Link.jsx'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import SessionStore from 'stores/session_store'
import StoryFeed from 'components/StoryFeed.jsx'
import Subheader from 'ui/Subheader.jsx'
import {connect} from 'redux/react'

@connect(state => ({
  featured: state.changelogs.featured,
  following: state.changelogs.following,
}))
export default class Dashboard extends React.Component {
  static propTypes = {
    featured: React.PropTypes.object,
    following: React.PropTypes.object,
  }

  render() {
    const { featured } = this.props

    return (
      <div>
        <Subheader text="Trending Groups Co-Creating Products" />

        <div className="sm-flex flex-wrap mxn2">
          {(featured || []).map((changelog, i) =>
            <div className="sm-col-4 p2" key={changelog.id + i}>
              <Link to="changelog" params={paramsFor.changelog(changelog)}>
                <ChangelogCard changelog={changelog} />
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }
}
