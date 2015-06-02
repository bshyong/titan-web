import ChangelogStore from '../stores/changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import Changelog from '../components/changelog.js.jsx'
import ChangelogHeader from '../components/ChangelogHeader.jsx'

export default class ChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(params.changelogId, ChangelogStore.timeInterval)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  render() {
    const { changelogId } = this.props
    return <div>
      <ChangelogHeader changelogId={changelogId} />
      <Changelog changelogId={changelogId} />
    </div>
  }
}
