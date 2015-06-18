import AutocompleteUserInput from './autocomplete_user_input.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsStore from '../stores/ContributorsStore'
import React from 'react'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(ContributorsStore)
export default class ContributorsInput extends React.Component {
  static getPropsFromStores() {
    return {
      contributors: ContributorsStore.contributorsAsString()
    }
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleFocus = this._handleFocus.bind(this)
  }

  componentDidUpdate() {
    if (this.selectionStart) {
      React.findDOMNode(this.refs.input).
        querySelectorAll('input')[0].
        setSelectionRange(this.selectionStart, this.selectionStart)
    }
  }

  render() {
    return <AutocompleteUserInput
              {...this.props}
              ref="input"
              placeholder="Who helped out?"
              value={this.props.contributors}
              onChange={this.handleChange}
              onFocus={this.handleFocus} />
  }

  _handleChange(e) {
    this.selectionStart = e.target.selectionStart
    ContributorsActions.setContributorsFromString(e.target.value)
  }

  _handleFocus(e) {
    this.selectionStart = e.target.selectionStart
  }
}
