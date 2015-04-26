import React from 'react'
import {RouteHandler} from 'react-router'
import HighlightsActionCreator from 'actions/highlights_action_creator'

export default class StoryComposer extends React.Component {
  componentDidMount() {
    HighlightsActionCreator.fetchAll('assembly')
  }

  render() {
    return <RouteHandler />
  }
}
