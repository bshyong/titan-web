import classnames from 'classnames'
import Dialog from '../ui/Dialog.jsx'
import Emoji from './Emoji.jsx'
import EmojiActions from '../actions/emoji_actions'
import EmojiPicker from './EmojiPicker.jsx'
import EmojiStore from '../stores/emoji_store'
import Picker from '../ui/RealPicker.jsx'
import React from 'react'

const ENTER_KEY = 13

export default class EmojiInput extends React.Component {
  static propTypes = {
    autoFocus: React.PropTypes.bool,
    defaultValue: React.PropTypes.string,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue,
      showDialog: false,
      focused: false,
    }
  }

  get value() {
    return this.props.value || this.state.value
  }

  componentDidMount() {
    EmojiActions.fetch()
    EmojiStore.addChangeListener(this.setState.bind(this, {}))
    if (this.props.autoFocus) {
      React.findDOMNode(this.refs.button).focus()
    }
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
      "field-light bg-white flex flex-center overflow-hidden pointer", {
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
             onKeyDown={this.handleKeyDown.bind(this)}
             style={{
               width: '3rem',
               height: '3rem',
               backgroundColor: 'white',
               borderRadius: '50%',
              }}
             ref="button">
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
      <Dialog onCloseRequested={() => this.setState({ showDialog: false, focused: false })}>
        <EmojiPicker defaultValue={this.value} onChange={this.handleDidChange.bind(this)} />
      </Dialog>
    )
  }

  handleKeyDown(e) {
    if (e.keyCode == ENTER_KEY) {
      this.handleWillChange()
    }
  }

  handleWillChange() {
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
