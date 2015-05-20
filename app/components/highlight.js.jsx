import {List} from 'immutable'
import Avatar from './ui/avatar.jsx'
import HighlightsStore from '../stores/highlights_store'
import HighlightActions from '../actions/highlight_actions'
import Icon from './ui/icon.js.jsx'
import moment from '../config/moment'
import React from 'react'
import Stack from './ui/stack.jsx'

const Sources = {
  'slack': 'slack',
  'trello-reporter': 'trello',
  'githubber': 'github'
}

export default class Highlight extends React.Component {
  constructor(props) {
    super(props)
    this.handleUse = this._handleUse.bind(this)
    this.handleIgnore = this._handleIgnore.bind(this)
  }

  render() {
    const {
      highlight: {label, content, created_at, occurred_at}
    } = this.props

    const sourceIcon = Sources[this.props.highlight.source] || 'quote-left'

    var formatted_content = content.substring(0, 300)
    if (content.length>300) {
      formatted_content = formatted_content + "..."
    }

    return (
      <div className="flex flex-center p1">

        <div className="flex-auto pointer p1" onClick={this.handleUse}>
          <p className="gray h5 mb0">
            <Icon icon={sourceIcon} fw={true} />
            {' '}
            {label}
            {' '}
            {moment(occurred_at || created_at).fromNow()}
          </p>
          <h4 className="mt0 mb0 block">{formatted_content}</h4>
          {this.renderAvatarStack()}
        </div>

        <a className="flex-none center p1 light-gray" onClick={this.handleIgnore} href="#">
          <Icon icon="times-circle" fw={true} />
        </a>

      </div>
    )
  }

  renderAvatarStack() {
    const {highlight: {mentioned_users}} = this.props
    const avatars = List(mentioned_users).map((user) => {
      return (
        <Avatar user={user} size={24} key={user.id} />
      )
    })

    if (avatars.isEmpty()) {
      return
    }

    return <div className="mt1"><Stack items={avatars} /></div>
  }

  _handleUse(e) {
    e.preventDefault()
    HighlightActions.use(this.props.highlight)
  }

  _handleIgnore(e) {
    e.preventDefault()
    HighlightActions.ignore(this.props.highlight)
  }

}
