import Changelog from '../components/changelog.js.jsx'
import ChangelogHeader from '../components/ChangelogHeader.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'

@connectToStores(ChangelogStore)
export default class ChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(RouterContainer.changelogSlug(), {
      group_by: 'markers'
    })
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
    return <DocumentTitle title={["Sets", changelogName].join(' · ')}>
      <div>
        <ChangelogHeader changelogId={changelogId} />
        <Changelog changelogId={changelogId} groupBy="markers" />
      </div>
    </DocumentTitle>
  }
}
