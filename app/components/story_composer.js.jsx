import ChangelogStore from 'stores/changelog_store'
import React from 'react'
import {RouteHandler} from 'react-router'
import HighlightsActionCreator from 'actions/highlight_actions'

export default class StoryComposer extends React.Component {
  static willTransitionTo(transition, params, query) {
    HighlightsActionCreator.fetchAll(params.changelogId)
  }

  render() {
    return <RouteHandler />
  }
}
