require('basscss/css/basscss.css')
import HighlightsStore from 'stores/highlights_store'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import React from 'react'
import Icon from 'components/ui/icon.js.jsx'

export default class Highlight extends React.Component {
  constructor(props) {
    super(props)
    this.handleUse = this._handleUse.bind(this)
    this.handleIgnore = this._handleIgnore.bind(this)
  }

  render() {
    const {
      highlight: {why, label, content}
    } = this.props

    return (
      <div className="flex-auto flex flex-column bg-white border rounded">
        <div className="flex-auto flex flex-center">
          <div className="full-width center p3">
            <h2 className="mt0 mb2 block">{label}</h2>
            <div className="gray">{why}</div>
          </div>

        </div>

        <div className="flex-none clearfix border-top">
          <div className="flex">
            <a className="half-width center p2 gray" onClick={this.handleIgnore}>
              Ignore
            </a>
            <div className="border-left"></div>
            <a className="half-width center p2 green" onClick={this.handleUse}>
              Use
            </a>
          </div>
        </div>
      </div>
    )
  }

  _handleUse(e) {
    e.preventDefault()
    HighlightsActionCreator.use(
      this.props.highlight
    )
  }

  _handleIgnore(e) {
    e.preventDefault()
    HighlightsActionCreator.ignore(
      this.props.highlight
    )
  }

}
