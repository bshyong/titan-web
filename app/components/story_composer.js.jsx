import { RouteHandler, Link } from 'react-router'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import HighlightsActionCreator from '../actions/highlight_actions'
import React from 'react'
import RouterContainer from '../lib/router_container'

@connectToStores(ChangelogStore)
export default class StoryComposer extends React.Component {
  static willTransitionTo(transition, params, query) {
    HighlightsActionCreator.fetchAll(params.changelogId)
  }

  static getPropsFromStores(props) {
    return { changelog: ChangelogStore.changelog }
  }

  componentWillMount() {
    this.coreTeamOnly(this.props)
  }

  componentWillReceiveProps(next) {
    this.coreTeamOnly(next)
  }

  coreTeamOnly(props) {
    if (props.changelog && !props.changelog.user_is_team_member) {
      setTimeout(() => RouterContainer.get().transitionTo('/'), 1)
    }

  }

  render() {
    return (
      <RouteHandler />
    )
  }
}
