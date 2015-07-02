import AutocompleteUserInput from './autocomplete_user_input.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsStore from '../stores/ContributorsStore'
import React from 'react'
import connectToStores from '../lib/connectToStores.jsx'
import classnames from 'classnames'

const KEYCODES = {
  ENTER: 13,
  TAB: 9,
}

@connectToStores(ContributorsStore)
export default class ContributorsInput extends React.Component {
  static getPropsFromStores() {
    return {
      tokens: ContributorsStore.tokens,
      currentMatch: ContributorsStore.currentMatch,
      lastInvalidToken: ContributorsStore.lastInvalidToken,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: false
    }

    this.handleChange = this._handleChange.bind(this)
    this.handleKeyDown = this._handleKeyDown.bind(this)
  }

  componentDidUpdate() {
    if (this.selectionStart) {
      React.findDOMNode(this.refs.input).
        querySelectorAll('input')[0].
        setSelectionRange(this.selectionStart, this.selectionStart)
    }
  }

  render() {
    const cs = classnames(
      "field-light flex flex-center flex-wrap",
      {"is-focused": this.state.focused}
    )
    return (
      <div className={cs}>
        <div className="flex flex-wrap">
          {this.renderTokens()}
        </div>
        <div className="flex-auto">
          <AutocompleteUserInput
            {...this.props}
            tabIndex="0"
            style={{outline: 'none'}}
            ref="input"
            className="border-none block full-width overflow-hidden"
            placeholder={this.props.tokens.isEmpty() ? "Who helped out?" : "Who else helped out?" }
            value={this.props.currentMatch}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)} />
        </div>
      </div>
    )
  }

  renderTokens() {
    return this.props.tokens.map(
      t => {
        return <div className="flex-none p1" key={t.string}>
          <div className="px1 bg-smoke black">
            {t.string}
          </div>
        </div>
      }
    )
  }

  _handleKeyDown(e) {
    // don't propagate if userPickerPopup is open
    if (!React.findDOMNode(this.refs.input.refs.userPickerPopup)) {
      if ([KEYCODES.ENTER, KEYCODES.TAB].includes(e.keyCode)) {
        e.preventDefault()
      }
      ContributorsActions.propagateKeyDown(e)
    }
  }

  _handleChange(e) {
    this.selectionStart = e.target.selectionStart
    ContributorsActions.setContributorsFromString(e.target.value)
  }

  handleFocus(e) {
    this.selectionStart = e.target.selectionStart
    this.setState({
      focused: true,
      selectionStart: e.target.selectionStart,
    })
  }

  handleBlur() {
    this.setState({
      focused: false,
    })
  }
}
