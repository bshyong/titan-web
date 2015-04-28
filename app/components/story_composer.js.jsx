import ChangelogStore from 'stores/changelog_store'
import React from 'react'
import {RouteHandler} from 'react-router'
import HighlightsActionCreator from 'actions/highlights_action_creator'

export default class StoryComposer extends React.Component {
  componentDidMount() {
    HighlightsActionCreator.fetchAll(ChangelogStore.slug)
  }

  render() {
    return <RouteHandler />
  }
}
