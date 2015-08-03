import { RouteHandler } from 'react-router'
import {connect} from 'redux/react'
import React from 'react'
import RouterContainer from '../lib/router_container'

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
