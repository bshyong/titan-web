import AvailableUsernameInputActions from 'actions/AvailableUsernameInputActions'
import AvailableUsernameInputStore from 'stores/AvailableUsernameInputStore'
import classnames from 'classnames'
import connectToStores from 'lib/connectToStores.jsx'
import React from 'react'

@connectToStores(AvailableUsernameInputStore)
export default class AvailableUsernameInput extends React.Component {
  static getPropsFromStores() {
    return { valid: AvailableUsernameInputStore.valid }
  }

  componentDidMount() {
    AvailableUsernameInputActions.validate(this.props.value)
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
  }

  render() {
    const classes = classnames(this.props.className, {
      'is-error': this.props.valid === false
    })
    return (
      <div className="clearfix">
        <input {...this.props}
          className={classes}
          onChange={this.handleChange} />
        {this.renderMessage()}
      </div>
    )
  }

  renderMessage() {
    const { valid, value } = this.props

    // `valid` can be `null`, in which case we do nothing
    if (valid === false) {
      return (
        <small className="red left mt1">
          {value} is taken. Try again!
        </small>
      )
    }

    return null
  }

  _handleChange(e) {
    AvailableUsernameInputActions.validate(e.target.value)

    this.props.onChange && this.props.onChange(e)
  }
}
