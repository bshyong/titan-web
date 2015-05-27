import {List, Set} from 'immutable'
import classnames from 'classnames'
import Emoji from '../ui/Emoji.jsx'
import EmojiActions from '../actions/emoji_actions.js'
import emojis from '../lib/emojis'
import EmojiStore from '../stores/emoji_store'
import Icon from '../ui/Icon.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import SessionStore from '../stores/session_store'

const emojiKeys = List(Object.keys(emojis))

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

export default class EmojiPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      emojis: emojiKeys,
      focused: false,
      label: '',
      selectedEmoji: EmojiStore.selectedEmoji
    }

    this.getStateFromStore = this.getStateFromStore.bind(this)
    this.handleChange = this._handleChange.bind(this)
    this.onStoreChange = this.onStoreChange.bind(this)
    this.selectEmoji = this.selectEmoji.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
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
    this.setState(this.getStateFromStore())
  }

  renderEmoji(emoji) {
    let a = emoji

    if (emoji == this.state.selectedEmoji) {
      return (
        <div className="p1 bg-silver" onClick={this.selectEmoji.bind(this, a)} key={a}>
          <div className="inline-block " style={{width: 18}}
            dangerouslySetInnerHTML={{__html: Emoji.parse(emojis[emoji])}} />
        </div>
      )
    }

    return (
      <div className="px1" onClick={this.selectEmoji.bind(this, a)} key={a}>
        <div className="inline-block " style={{width: 18}}
          dangerouslySetInnerHTML={{__html: Emoji.parse(emojis[emoji])}} />
      </div>
    )
  }

  renderEmojis() {
    if (this.state.emojis) {
      let classes = classnames('left mt1 transition-stagger overflow-hidden', {
        'transition-stagger--focused': this.state.focused
      })
      return (
        <div className={classes} style={{ height: 40 }}>
          {List(this.state.emojis).take(8).map(this.renderEmoji.bind(this))}
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <input className="p1 field-light left border-silver"
          placeholder="Label"
          onBlur={this.toggleFocus}
          onFocus={this.toggleFocus}
          value={this.state.label}
          onChange={this.handleChange} />
        {this.renderEmojis()}
      </div>
    )
  }

  getStateFromStore() {
    return {
      selectedEmoji: EmojiStore.selectedEmoji
    }
  }

  _handleChange(e) {
    const { value } = e.target;

    this.setState({
      emojis: emojiKeys.filter(e => e.indexOf(value) > -1),
      label: value
    })
  }

  _toggleFocus(e) {
    this.setState({
      focused: !this.state.focused
    })
  }

}
