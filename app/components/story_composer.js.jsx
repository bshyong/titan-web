import { RouteHandler, Link } from 'react-router'
import ChangelogStore from '../stores/changelog_store'
import HighlightsActionCreator from '../actions/highlight_actions'
import React from 'react'
import RouterContainer from '../lib/router_container'

export default class StoryComposer extends React.Component {
  static willTransitionTo(transition, params, query) {
    HighlightsActionCreator.fetchAll(params.changelogId)
  }

  render() {
    return (
      <div className="container p2">
        <RouteHandler />
      </div>
    )
  }
}
