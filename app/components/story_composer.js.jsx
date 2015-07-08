import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import HighlightsActionCreator from '../actions/highlight_actions'
import React from 'react'
import RouterContainer from '../lib/router_container'
import { RouteHandler } from 'react-router'
import Link from '../components/Link.jsx'

@connectToStores(ChangelogStore)
export default class StoryComposer extends React.Component {
  static willTransitionTo(transition, params, query) {
    HighlightsActionCreator.fetchAll(RouterContainer.changelogSlug(params))
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
    const { changelog } = props
    if (changelog && !(changelog.anyone_can_write || changelog.user_is_team_member)) {
      setTimeout(() => RouterContainer.get().transitionTo('/'), 1)
    }
  }

  render() {
    return (
      <RouteHandler />
    )
  }
}
