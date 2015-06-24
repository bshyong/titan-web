import AuthenticationFormActions from 'actions/AuthenticationFormActions'
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
      <div className="flex">
        <div className="flex-none col-4 mx-auto py4">
          <img className="flex-none mr2" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Reset your password</h1>

          <h5 className="mt0">
            Enter your new password below
          </h5>

          <div className="mt2">
            <div className="border border-silver rounded p2">
              <form className="clearfix">
                <div className="py1">
                  <input type="password"
                    className="block full-width field-light"
                    value={password}
                    onChange={this.handleChange}  />
                </div>

                <div className="py2">
                  <Button size="big"
                    color="black bg-darken-2"
                    block
                    action={this.handleSubmit}>
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleChange(e) {
    AuthenticationFormActions.change(Map({ password: e.target.value }))
  }

  _handleSubmit(e) {
    const { password, token } = this.props
    e.preventDefault()
    AuthenticationFormActions.submit('password/reset', { password, token })
  }
}
