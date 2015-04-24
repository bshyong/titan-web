require('basscss/css/basscss.css')
import PostsActionCreator from 'actions/highlights_action_creator'
import HighlightsStore from 'stores/highlights_store'
import React from 'react'

export default class Highlight extends React.Component {
  render() {
    const {
      highlight: {why, label, content}
    } = this.props

    return (
      <div className="clearfix h5">
        <div className="left mr1 mid-gray">
          <span className="fa fa-star fa-fw"></span>
        </div>
        <div className="overflow-hidden">
          <div className="mid-gray">{why}</div>
          <div className="bold">{label}</div>
        </div>
      </div>
    )
  }
}
