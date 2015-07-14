import classnames from 'classnames'
import React from 'react'

export default class PasswordInputAndHelper extends React.Component {
  static fieldClasses(valid) {
    return {
      input: classnames("block full-width field-light", {
        'is-error': !valid
      }),
      helper: classnames("left", {
        bold: !valid,
        gray: valid,
        red: !valid
      })
    }
  }

  static isValidPassword(password) {
    return password.length < 1 || password.length >= 8
  }

  render() {
    const { children, value } = this.props
    const valid = PasswordInputAndHelper.isValidPassword(value)
    const classes = PasswordInputAndHelper.fieldClasses(valid)

    return (
      <div>
        <label className="left bold" htmlFor="signup-password">Password</label>
        <input type="password"
          className={classes.input}
          value={value}
          {...this.props} />
        <small className={classes.helper}>8 characters minimum</small>
      </div>
    )
  }
}
