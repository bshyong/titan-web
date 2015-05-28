import {List, Set} from 'immutable'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import Emoji from '../ui/Emoji.jsx'
import EmojiActions from '../actions/emoji_actions.js'
import EmojiStore from '../stores/emoji_store'
import Icon from '../ui/Icon.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import SessionStore from '../stores/session_store'
import shouldPureComponentUpdate from 'react-pure-render/function'

@connectToStores(EmojiStore)
export default class EmojiPicker extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static getPropsFromStores(props) {
    return {
      emojis: EmojiStore.emojis,
      selectedEmoji: EmojiStore.selectedEmoji,
      selectedEmojiName: EmojiStore.selectedEmojiName
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }

    this.handleChange = this._handleChange.bind(this)
    this.selectEmoji = this._selectEmoji.bind(this)
    this.toggleFocus = this._toggleFocus.bind(this)
  }

  componentDidMount() {
    const { selectedEmojiName } = this.props
    selectedEmojiName ?
      EmojiActions.search(this.props.selectedEmojiName) :
      EmojiActions.fetch()
  }

  renderEmoji(emoji) {
    const classes = classnames('px1 pointer', {
      'mt0 bg-smoke rounded border border-silver': emoji.id === this.props.selectedEmoji
    })

    return (
      <div className={classes} onClick={this.selectEmoji.bind(this, emoji)} key={emoji.id}>
        <div className="inline-block"
          style={{width: 18, paddingTop: 8}}
          dangerouslySetInnerHTML={{__html: Emoji.parse(emoji.character)}} />
      </div>
    )
  }

  renderEmojis() {
    if (this.props.emojis) {
      let classes = classnames('left ml1 transition-stagger overflow-hidden', {
        'transition-stagger--focused': this.state.focused || this.props.selectedEmoji
      })
      return (
        <div className={classes} style={{ height: 40 }}>
          {this.props.emojis.take(8).map(this.renderEmoji.bind(this))}
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
          value={this.props.selectedEmojiName}
          onChange={this.handleChange} />
        {this.renderEmojis()}
      </div>
    )
  }

  _handleChange(e) {
    const { value } = e.target

    EmojiActions.search(value.replace(/[^A-Za-z0-9_\-]/g, ''))
  }

  _selectEmoji(emoji, e) {
    e.stopPropagation()

    EmojiActions.selectEmoji(emoji)
  }

  _toggleFocus(e) {
    setTimeout(() => {
      this.setState({
        focused: !this.state.focused
      })
    }, 100)
  }
}

EmojiPicker.defaultProps = {
  emojis: List()
}

EmojiPicker.propTypes = {
  emojis: React.PropTypes.shape({
    take: React.PropTypes.func.isRequired,
    map: React.PropTypes.func.isRequired
  }).isRequired,

  selectedEmoji: React.PropTypes.string,
  selectedEmojiName: React.PropTypes.string
}