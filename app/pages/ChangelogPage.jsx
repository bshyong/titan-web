import ChangelogStore from '../stores/changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import Changelog from '../components/changelog.js.jsx'

export default class ChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(params.changelogId, ChangelogStore.timeLength)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  render() {
    return <Changelog changelogId={this.props.changelogId} />
  }
}
