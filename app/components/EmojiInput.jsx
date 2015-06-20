import classnames from 'classnames'
import Dialog from '../ui/Dialog.jsx'
import Emoji from './Emoji.jsx'
import EmojiActions from '../actions/emoji_actions'
import EmojiPicker from './EmojiPicker.jsx'
import EmojiStore from '../stores/emoji_store'
import Picker from '../ui/RealPicker.jsx'
import React from 'react'

export default class EmojiInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue,
      showDialog: false,
      focused: false,
    }
  }

  static getPropsFromStores(props) {
    return props
  }

  get value() {
    return this.props.value || this.state.value
  }

  componentDidMount() {
    EmojiActions.fetch()
    EmojiStore.addChangeListener(this.setState.bind(this, {}))
  }

  componentWillUnmount() {
    EmojiStore.removeChangeListener(this.setState.bind(this, {}))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value || this.state.value
    })
  }

  render() {
    const cs = classnames(
      "field-light bg-white circle flex flex-center overflow-hidden pointer", {
        "is-focused": this.state.focused
      }
    )

    return (
      <div>
        <div className={cs}
             tabIndex={0}
             onClick={this.handleWillChange.bind(this)}
             onFocus={this.handleToggleFocus.bind(this)}
             onBlur={this.handleToggleFocus.bind(this)}
             style={{width: '3rem', height: '3rem', backgroundColor: 'white'}}>
          {this.renderEmoji()}
        </div>
        {this.renderDialog()}
      </div>
    )
  }

  renderEmoji() {
    const emoji = EmojiStore.find(this.value)
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
    if (!this.state.showDialog) {
      return
    }
    return (
      <Dialog>
        <EmojiPicker defaultValue={this.value} onChange={this.handleDidChange.bind(this)} />
      </Dialog>
    )
  }

  handleWillChange(e) {
    this.setState({
      showDialog: true,
      focused: true,
    })
  }

  handleDidChange(e) {
    this.setState({
      value: e.value,
      showDialog: false,
      focused: false,
    })
    this.props.onChange({target: {value: e.value}})
  }

  handleToggleFocus() {
    this.setState({focused: !this.state.focused})
  }
}

EmojiInput.propTypes = {
  value: React.PropTypes.string,
  defaultValue: React.PropTypes.string,
  onChange: React.PropTypes.func,
}
