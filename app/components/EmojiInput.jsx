import classnames from 'classnames'
import { connect } from 'redux/react'
import Dialog from 'ui/Dialog.jsx'
import Emoji from 'components/Emoji.jsx'
import EmojiActions from 'actions/emoji_actions'
import EmojiPicker from 'components/EmojiPicker.jsx'
import EmojiStore from 'stores/emoji_store'
import * as EmojiInputActions from 'actions/EmojiInputActions'
import Picker from 'ui/RealPicker.jsx'
import React from 'react'

import DefaultImgSrc from 'images/emoji-input-default.svg'

const ENTER_KEY = 13

@connect(state => ({
  emojis: state.emojiInput.get('emojis'),
  isFocused: state.emojiInput.get('isFocused'),
  isOpen: state.emojiInput.get('isOpen'),
  value: state.emojiInput.get('value')
}))
export default class EmojiInput extends React.Component {
  static propTypes = {
    autoFocus: React.PropTypes.bool,
    defaultValue: React.PropTypes.string,
    // dispatch comes from the @connect decorator
    dispatch: React.PropTypes.func.isRequired,
    emojis: React.PropTypes.object,
    onChange: React.PropTypes.func,
    isFocused: React.PropTypes.bool,
    isOpen: React.PropTypes.bool,
    value: React.PropTypes.string,
  }

  componentDidMount() {
    this.props.dispatch(EmojiInputActions.fetch())
    if (this.props.autoFocus) {
      React.findDOMNode(this.refs.button).focus()
    }
  }

  render() {
    const {
      isFocused,
      value
    } = this.props
    const cs = classnames(
      "field-light bg-white flex flex-center overflow-hidden pointer", {
        "is-focused": isFocused
      }
    )

    const style = {
      width: '3rem',
      height: '3rem',
      backgroundColor: 'white',
      borderRadius: '50%',
      backgroundImage: (!value ? `url(${DefaultImgSrc})` : ''),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }

    return (
      <div>
        <div className={cs}
          tabIndex={0}
          onClick={this.handleWillChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          style={style}
          ref="button">
          {this.renderEmoji()}
        </div>
        {this.renderDialog()}
      </div>
    )
  }

  renderEmoji() {
    if (!this.props.emojis) {
      return
    }
    const emoji = this.props.emojis.find(e => e.id === this.props.value)
    if (!emoji) {
      return
    }
    return (
      <div className="mx-auto">
        <Emoji emoji={emoji} size={24} />
      </div>
    )
  }

  renderDialog() {
    const { dispatch, isOpen, value } = this.props
    if (isOpen) {
      return (
        <Dialog onCloseRequested={() => dispatch(EmojiInputActions.blur())}>
          <EmojiPicker defaultValue={value} onChange={this.handleDidChange.bind(this)} />
        </Dialog>
      )
    }
  }

  handleKeyDown(e) {
    if (e.keyCode == ENTER_KEY) {
      this.handleWillChange()
    }
  }

  handleWillChange() {
    this.props.dispatch(EmojiInputActions.open())
  }

  handleDidChange(e) {
    this.props.onChange({target: {value: e.value}})
    this.props.dispatch(EmojiInputActions.select(e.value))
  }

  handleBlur() {
    this.props.dispatch(EmojiInputActions.blur())
  }

  handleFocus() {
    this.props.dispatch(EmojiInputActions.focus())
  }
}
