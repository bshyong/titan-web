import {List, Set} from 'immutable'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import emojiDict from '../lib/emoji'
import Emoji from '../ui/Emoji.jsx'
import EmojiActions from '../actions/emoji_actions.js'
import EmojiStore from '../stores/emoji_store'
import EMOJI_REGEX from '../lib/emoji_regex'
import Icon from '../ui/Icon.jsx'
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
      EmojiActions.search(selectedEmojiName) :
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
    const { emojis, selectedEmoji } = this.props
    if (emojis && emojis.size > 0) {
      let classes = classnames('transition-stagger overflow-hidden mxn1', {
        'transition-stagger--focused': this.state.focused || selectedEmoji
      })

      return (
        <div>
          <div className={classes} style={{ height: 66 }}>
            {emojis.take(6).map(this.renderEmoji.bind(this))}
            <div className="h5 px1 mt1">
              <a className="gray" href="http://www.emoji-cheat-sheet.com" target="_blank">
                (Need a <img className="inline-block" src="https://twemoji.maxcdn.com/svg/270b.svg" style={{width: "0.8rem"}} alt="hand" />?)
              </a>
            </div>
          </div>
          {this.renderInspirationLink()}
        </div>
      )
    }
  }

  renderInspirationLink() {
    if (!this.state.focused) {
      return
    }

    return (
      <div></div>
    )
  }

  render() {
    return (
      <div>
        <div>
          <input
            {...this.props}
            type="text"
            placeholder="Pick a label"
            onBlur={this.toggleFocus}
            onFocus={this.toggleFocus}
            value={this.props.selectedEmojiName}
            onChange={this.handleChange} />
        </div>
        <div className="p1">
          {this.renderEmojis()}
        </div>
      </div>
    )
  }

  _handleChange(e) {
    const { value } = e.target
    if (EMOJI_REGEX.test(value)) {
      return EmojiActions.find(value)
    }

    EmojiActions.search(value.replace(/[^A-Za-z0-9_\-:]/g, ''))
  }

  _selectEmoji(emoji, e) {
    e.stopPropagation()

    let emojiCopy = Object.assign({}, emoji)

    emojiCopy.name = `:${emoji.name}:`

    EmojiActions.selectEmoji(emojiCopy)
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
