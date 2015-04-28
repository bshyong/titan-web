require('basscss/css/basscss.css')
import HighlightsStore from 'stores/highlights_store'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import React from 'react'
import Icon from 'components/ui/icon.js.jsx'

const Sources = [
  {name: 'Github', icon: 'github'},
  {name: 'Trello', icon: 'trello'},
  {name: 'Slack', icon: 'slack'}
]

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
      <div className="flex flex-center px1">

        <div className="flex-none px1">
          {this.source()}
        </div>

        <div className="flex-auto p1">
          <h4 className="mt0 mb0 block">{label}</h4>
          <div className="h5 gray">{why}</div>
        </div>

        <a className="flex-none center p1 green" onClick={this.handleUse} href="#">
          Use
        </a>

        <a className="flex-none center p1 gray" onClick={this.handleIgnore} href="#">
          <Icon icon="times-circle" />
        </a>

      </div>
    )
  }

  source() {
    const s = Sources[Math.floor(Math.random() * Sources.length)]
    return (
      <div className="h3">
        <Icon icon={s.icon} />
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
