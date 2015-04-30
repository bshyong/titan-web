import {List} from 'immutable'
import Avatar from 'components/ui/avatar.jsx'
import HighlightsStore from 'stores/highlights_store'
import HighlightsActionCreator from 'actions/highlight_actions'
import Icon from 'components/ui/icon.js.jsx'
import moment from 'moment'
import React from 'react'
import Stack from 'components/ui/stack.jsx'

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
      highlight: {content, occurred_at, mentioned_users}
    } = this.props

    const avatars = List(mentioned_users).map((user) => {
      return (
        <Avatar user={user} size={24} key={user.id} />
      )
    })

    return (
      <div className="flex flex-center p1">

        <div className="flex-auto pointer" onClick={this.handleUse}>
          <div className="flex flex-center">
            <div className="flex-none px1">
              {this.source()}
            </div>

            <div className="flex-auto p1">
              <h4 className="mt0 mb0 block">{content}</h4>
              <p className="gray h5 mb1">
                {moment(occurred_at).fromNow()}
              </p>
              <Stack items={avatars} />
            </div>
          </div>
        </div>

        <a className="flex-none center p1 gray" onClick={this.handleIgnore} href="#">
          <Icon icon="times-circle" fw={true} />
        </a>

      </div>
    )
  }

  source() {
    const icon = Sources[this.props.highlight.source]
    return (
      <div className="h3 light-gray">
        <Icon icon={icon} fw={true} />
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
