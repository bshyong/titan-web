import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import Emoji from './Emoji.jsx'
import EmojiActions from '../actions/emoji_actions.js'
import EmojiStore from '../stores/emoji_store'
import Picker from '../ui/RealPicker.jsx'
import React from 'react'

const EmojiGridRows = 3
const ENTER_KEY = 13

@connectToStores(EmojiStore)
export default class EmojiPicker extends React.Component {

  static getPropsFromStores(props) {
    return props
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue
    }
  }

  componentDidMount() {
    React.findDOMNode(this.refs.search).focus()
  }

  renderEmojis() {
    const minHeight = EmojiGridRows * 16 * 3.5
    if (EmojiStore.isEmpty()) {
      return <div style={{minHeight: minHeight}} />
    }

    const { query } = this.state
    let emojis = null

    if (query) {
      emojis = EmojiStore.search(query)
    } else {
      emojis = EmojiStore.all
    }

    return (
      <div className="flex flex-wrap px2" style={{minHeight}}>
        {emojis.take(8 * EmojiGridRows).map(this.renderEmoji.bind(this))}
      </div>
    )
  }

  render() {
    return (
      <Picker value={this.renderValue()} onCancel={this.handleCancel.bind(this)} onOk={this.handleChange.bind(this)}>
        <div className="border-bottom mb2">
          <input type="search"
                 className="input-invisible block full-width"
                 style={{paddingLeft: '1rem', paddingRight: '1rem'}}
                 placeholder={EmojiStore.isEmpty() ? null : "Search for a descriptive emoji"}
                 onChange={this.handleSearchChange.bind(this)}
                 ref="search" />
        </div>
        {this.renderEmojis()}
      </Picker>
    )
  }

  renderEmoji(emoji) {
    let selected = emoji.id === this.state.value
    return (
      <div className="p2 pointer circle"
           style={{backgroundColor: (selected && '#F1F1F1')}}
           onClick={this.selectEmoji.bind(this, emoji)}
           onDoubleClick={this.handleChange.bind(this)}
           key={emoji.id}>
        <Emoji emoji={emoji} size={24} />
      </div>
    )
  }

  renderValue() {
    const emoji = EmojiStore.find(this.state.value)

    // Fill out the height so the bar doesn't jump around the place
    if (!emoji) {
      return <div style={{minHeight: "3rem"}} />
    }

    return (
      <div className="flex flex-center">
        <div className="mr2">
          <div className="bg-white circle center flex flex-center p1" style={{width: '2rem', height: '2rem'}}>
            <div className="mx-auto">
              <Emoji emoji={emoji} size={24} />
            </div>
          </div>
        </div>

        <div className="white truncate">
          :{emoji.name}:
        </div>
      </div>
    )
  }

  handleSearchChange(e) {
    this.setState({query: e.target.value.replace(/:/g, '')})
  }

  selectEmoji(emoji, e) {
    this.setState({value: emoji.id})
  }

  handleChange(e) {
    this.props.onChange({value: this.state.value})
  }

  handleCancel(e) {
    this.props.onChange({value: this.props.defaultValue})
  }
}

EmojiPicker.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  defaultValue: React.PropTypes.string.isRequired,
}

EmojiPicker.defaultProps = {
  defaultValue: "c6a2b5b8-b1fc-4ff0-b108-746cef842362"
}
