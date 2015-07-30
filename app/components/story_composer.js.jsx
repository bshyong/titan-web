import { RouteHandler } from 'react-router'
import {connect} from 'redux/react'
import fetchData from 'decorators/fetchData'
import HighlightsActionCreator from '../actions/highlight_actions'
import React from 'react'
import RouterContainer from '../lib/router_container'

@fetchData(params => {
  HighlightsActionCreator.fetchAll(RouterContainer.changelogSlug(params))
})
@connect(state => ({
  changelog: state.currentChangelog.changelog,
}))
export default class StoryComposer extends React.Component {
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
