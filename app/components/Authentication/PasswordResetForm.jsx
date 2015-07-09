import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import Button from 'ui/Button.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import PasswordResetActions from 'actions/PasswordResetActions'
import PasswordResetFormStore from 'stores/PasswordResetFormStore'
import React from 'react'
import SigninScrim from 'components/Authentication/SigninScrim.jsx'
import SigninScrimActions from 'actions/SigninScrimActions'

@connectToStores(AuthenticationFormStore, PasswordResetFormStore)
export default class PasswordResetForm extends React.Component {
  static getPropsFromStores() {
    return {
      ...AuthenticationFormStore.formContent
    }
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount() {
    SigninScrimActions.show(PasswordResetForm)
  }

  render() {
    const { password } = this.props

    return (
      <div className="flex flex-center">
        <div className="flex-none sm-col-4 mx-auto py4">
          <img className="flex-none" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Reset your password</h1>

          <h5 className="mt0">
            Enter your new password below
          </h5>

          <div className="mt2">
            <div className="border border-silver rounded p2">
              <form className="clearfix">
                <div className="py1">
                  <input autoFocus
                    ref="password"
                    type="password"
                    className="block full-width field-light"
                    value={password}
                    onChange={this.handleChange}  />
                </div>

                <div className="py2">
                  <AuthenticationFormButton
                    action={this.handleSubmit}
                    disabled={this.isButtonDisabled()}>
                    Submit
                  </AuthenticationFormButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  isButtonDisabled() {
    return !this.props.password
  }

  _handleChange(e) {
    AuthenticationFormActions.change(Map({ password: e.target.value }))
  }

  _handleSubmit(e) {
    e.preventDefault()
    let { password, token } = this.props

    // we need this check in case the form is autofilled or filled
    // from LastPassword or 1Password or something
    if (!password) {
      password = React.findDOMNode(this.refs.password).value
    }

    AuthenticationFormActions.submit('password/reset', { password, token })
  }
}
