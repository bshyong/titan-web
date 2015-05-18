import React from 'react'
import Icon from 'components/ui/icon.js.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import SessionStore from 'stores/session_store'
import EmojiStore from 'stores/emoji_store'
import EmojiActions from 'actions/emoji_actions.js'
import {List, Set} from 'immutable'

export default class EmojiPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getStateFromStore()
    this.selectEmoji = this.selectEmoji.bind(this)
    this.onStoreChange = this.onStoreChange.bind(this)
    this.getStateFromStore = this.getStateFromStore.bind(this)
  }

  selectEmoji(emoji_id) {
    EmojiActions.selectEmoji(emoji_id)
  }

  componentDidMount() {
    EmojiStore.addChangeListener(this.onStoreChange)
    EmojiActions.fetch()
  }

  componentWillUnmount() {
    EmojiStore.removeChangeListener(this.onStoreChange)
  }

  onStoreChange() {
    var states = this.getStateFromStore()
    this.setState(states)
  }

  renderEmoji(emoji) {
    var a = emoji.id
    if (emoji.id == this.state.selectedEmoji) {
      return (
        <span className="px1 field-light" onClick={this.selectEmoji.bind(this, a)} key={a}>
          {emoji.character}
        </span>
      )
    }
    else {
      return (
        <span className="px1" onClick={this.selectEmoji.bind(this, a)} key={a}>
          {emoji.character}
        </span>
      )
    }
  }

  renderEmojis() {
    if (this.state.emojis) {
      var emojis = List(this.state.emojis)
      return (
          <span className="border p1">
            {emojis.map((emoj) => {
              return (this.renderEmoji(emoj))
            })}
          </span>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderEmojis()}
      </div>
    )
  }

  getStateFromStore(){
    return (
      {
        emojis: EmojiStore.emojis,
        selectedEmoji: EmojiStore.selectedEmoji
      }
    )
  }

}
