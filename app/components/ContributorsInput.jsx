import AutocompleteUserInput from './autocomplete_user_input.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsStore from '../stores/ContributorsStore'
import React from 'react'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(ContributorsStore)
export default class ContributorsInput extends React.Component {
  static getPropsFromStores() {
    return {
      contributors: ContributorsStore.contributorsAsString(),
      tokens: ContributorsStore.tokens
    }
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleFocus = this._handleFocus.bind(this)
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
    return (
      <div className="flex flex-baseline border border-silver flex-wrap px1">
        <div className="flex flex-wrap">
          {this.renderTokens()}
        </div>
        <div className="flex-auto">
          <AutocompleteUserInput
            {...this.props}
            ref="input"
            placeholder="Who helped out?"
            value={this.props.contributors}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onFocus={this.handleFocus} />
        </div>
      </div>
    )
  }

  renderTokens() {
    return this.props.tokens.map(
      t => {
        return <span className="mr1 flex-none">
          {t.string},
        </span>
      }
    )
  }

  _handleKeyDown(e) {
    ContributorsActions.propagateKeyDown(e)
  }

  _handleChange(e) {
    this.selectionStart = e.target.selectionStart
    ContributorsActions.setContributorsFromString(e.target.value)
  }

  handleFocus(e) {
    this.selectionStart = e.target.selectionStart
  }
}
