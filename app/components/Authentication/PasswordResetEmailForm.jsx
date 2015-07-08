import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import AuthenticationFormError from 'components/Authentication/AuthenticationFormError.jsx'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import Button from 'ui/Button.jsx'
import classnames from 'classnames'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import PasswordResetActions from 'actions/PasswordResetActions'
import PasswordResetFormStore from 'stores/PasswordResetFormStore'
import React from 'react'
import SessionActions from 'actions/SessionActions'
import SigninScrimActions from 'actions/SigninScrimActions'

@connectToStores(AuthenticationFormStore, PasswordResetFormStore)
export default class PasswordResetEmailForm extends React.Component {
  static getPropsFromStores() {
    return {
      ...AuthenticationFormStore.formContent,
      confirmation: PasswordResetFormStore.confirmation,
      confirmationType: PasswordResetFormStore.confirmationType
    }
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
  }

  render() {
    return (
      <div className="flex flex-center">
        <div className="col-10 sm-col-4 mx-auto py4">
          <img className="flex-none" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Forgot your password?</h1>

          <h5 className="mt0">
            Enter the email address associated with your account below.
            We'll send password reset instructions right away.
          </h5>

          <div className="mt2">
            <div className="border border-silver rounded p2">
              <AuthenticationFormError />
              {this.renderForm()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderForm() {
    const { email, confirmation, confirmationType } = this.props

    if (confirmation) {
      const classes = classnames(confirmationType, 'white rounded p2')
      return (
        <div className={classes}>
          {confirmation}
        </div>
      )
    }

    return (
      <form className="clearfix">
        <div className="py1">
          <label className="left bold" htmlFor="password-email">Email</label>
          <input autoFocus
            type="email"
            id="password-email"
            className="block full-width field-light"
            placeholder="jane@example.com"
            value={email}
            onChange={this.handleChange} />
        </div>

        <div className="py2">
          <AuthenticationFormButton action={this.handleSubmit} disabled={this.isButtonDisabled()}>
            Send reset link
          </AuthenticationFormButton>
        </div>
      </form>
    )
  }

  isButtonDisabled() {
    return !this.props.email
  }

  _handleChange(e) {
    AuthenticationFormActions.change(Map({ email: e.target.value }))
  }

  _handleSubmit(e) {
    e.preventDefault()
    PasswordResetActions.submitEmail(this.props.email)
  }
}
