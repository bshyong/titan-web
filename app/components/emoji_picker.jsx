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

    this.handleChange = this._handleChange.bind(this)
    this.onStoreChange = this.onStoreChange.bind(this)
    this.selectEmoji = this._selectEmoji.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
  }

  componentDidMount() {
    EmojiStore.addChangeListener(this.onStoreChange)
    EmojiActions.fetch()
  }

  componentWillUnmount() {
    EmojiStore.removeChangeListener(this.onStoreChange)
  }

  onStoreChange() {
    this.setState({
      selectedEmoji: EmojiStore.selectedEmoji
    })
  }

  renderEmoji(emoji) {
    const classes = classnames('px1 pointer', {
      'mt0 bg-smoke rounded border border-silver': emoji === this.state.selectedEmoji
    })

    return (
      <div className={classes} onClick={this.selectEmoji.bind(this, emoji)} key={emoji}>
        <div className="inline-block " style={{width: 18, paddingTop: 8}}
          dangerouslySetInnerHTML={{__html: Emoji.parse(emojis[emoji])}} />
      </div>
    )
  }

  renderEmojis() {
    if (this.state.emojis) {
      let classes = classnames('left ml1 transition-stagger overflow-hidden', {
        'transition-stagger--focused': this.state.focused || this.state.selectedEmoji
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
          placeholder="Badge"
          onBlur={this.toggleFocus}
          onFocus={this.toggleFocus}
          value={this.state.label}
          onChange={this.handleChange} />
        {this.renderEmojis()}
      </div>
    )
  }

  _handleChange(e) {
    const { value } = e.target;
    const emojis = emojiKeys.filter(e => e.indexOf(value) > -1)

    this.setState({
      emojis: emojis,
      label: value,
    })

    if (emojiKeys.contains(value)) {
      EmojiActions.selectEmoji(value)
    } else {
      EmojiActions.selectEmoji()
    }
  }

  _selectEmoji(emoji, e) {
    e.stopPropagation()

    EmojiActions.selectEmoji(emoji)

    this.setState({
      emojis: emojiKeys.filter(e => e.indexOf(emoji) > -1),
      label: emoji
    })
  }

  _toggleFocus(e) {
    setTimeout(() => {
      this.setState({
        focused: !this.state.focused
      })
    }, 100)
  }

}
