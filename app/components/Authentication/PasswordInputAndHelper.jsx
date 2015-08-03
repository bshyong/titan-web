import classnames from 'classnames'
import React from 'react'

export default class PasswordInputAndHelper extends React.Component {
  static fieldClasses(valid) {
    return {
      input: classnames("block left full-width field-light", {
        'is-error': !valid,
      }),
      helper: classnames("left", {
        bold: !valid,
        gray: valid,
        red: !valid,
      }),
    }
  }

  static isValidPassword(password) {
    if (!password) {
      return true
    }

    return password.length < 1 || password.length >= 8
  }

  render() {
    const { children, value } = this.props
    const valid = PasswordInputAndHelper.isValidPassword(value)
    const classes = PasswordInputAndHelper.fieldClasses(valid)

    // the input will render weirdly if we leave
    // children in props
    delete this.props.children

    return (
      <div>
        <label className="left bold" htmlFor="password">Password</label>
        <input id="password"
          type="password"
          className={classes.input}
          value={value}
          {...this.props} />
        {children}
        <small className={classes.helper}>8 characters minimum</small>
      </div>
    )
  }
}
