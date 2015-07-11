import Changelog from '../components/changelog.js.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'

@connectToStores(ChangelogStore)
export default class ChangelogByDatePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(RouterContainer.changelogSlug(params), {
      group_by: 'calendar'
    })
    StoryActions.fetchPinned(RouterContainer.changelogSlug(params))
  }

  static getPropsFromStores(props) {
    return {
      changelogName: ChangelogStore.changelog && ChangelogStore.changelog.name
    }
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug()
    }
  }

  render() {
    const { changelogId, changelogName } = this.props
    return <DocumentTitle title={["Posts", changelogName].join(' · ')}>
      <div>
        <Changelog changelogId={changelogId} groupBy="calendar" />
      </div>
    </DocumentTitle>
  }
}
