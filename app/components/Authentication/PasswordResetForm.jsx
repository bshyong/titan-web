import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import Button from 'ui/Button.jsx'
import { connect } from 'redux/react'
import Icon from 'ui/Icon.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import PasswordResetActions from 'actions/PasswordResetActions'
import React from 'react'
import SigninScrim from 'components/Authentication/SigninScrim.jsx'
import SigninScrimActions from 'actions/SigninScrimActions'

export default class PasswordResetForm extends React.Component {
  static propTypes = {
    change: React.PropTypes.func.isRequired,
    changeForm: React.PropTypes.func.isRequired,
    formContent: React.PropTypes.shape({
      password: React.PropTypes.string,
      redirectTo: React.PropTypes.string
    }),
    submit: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
  }

  render() {
    const { password } = this.props.formContent

    return (
      <div className="flex flex-center center">
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
    return !this.props.formContent.password
  }

  _handleChange(e) {
    this.props.change(Map({ password: e.target.value }))
  }

  _handleSubmit(e) {
    e.preventDefault()
    let {
      formContent: { password },
    } = this.props

    // we need this check in case the form is autofilled or filled
    // from LastPassword or 1Password or something
    if (!password) {
      password = React.findDOMNode(this.refs.password).value
    }

    this.props.submit(`password/reset${window.location.search}`, { password })
  }
}
