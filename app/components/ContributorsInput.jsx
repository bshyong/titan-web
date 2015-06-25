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
      contributors: ContributorsStore.contributorsAsString(),
      validTokens: ContributorsStore.validTokens,
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
    const { validTokens } = this.props
    const cs = classnames(
      "field-light flex flex-baseline flex-wrap",
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
            placeholder={validTokens.isEmpty() ? 'Who helped out?' : 'Anyone else?'}
            value={this.props.currentMatch}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)} />
        </div>
      </div>
    )
  }

  renderInvalidTokenText() {
    const { lastInvalidToken, validTokens, currentMatch } = this.props
    return lastInvalidToken ? `${lastInvalidToken} is neither a valid username nor an email address` : '&nbsp;'
  }

  renderTokens() {
    return this.props.validTokens.map(
      t => {
        return <span className="flex-none ml1 bg-smoke black px1" key={t.string}>
          {t.string}
        </span>
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
