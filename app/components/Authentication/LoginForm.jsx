import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import AuthenticationFormError from 'components/Authentication/AuthenticationFormError.jsx'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import Button from 'ui/Button.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import onMobile from 'lib/on_mobile'
import PasswordResetEmailForm from 'components/Authentication/PasswordResetEmailForm.jsx'
import React from 'react'
import TwitterActions from 'actions/oauth/TwitterActions'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'

@connectToStores(AuthenticationFormStore)
export default class LoginForm extends React.Component {
  static getPropsFromStores() {
    return AuthenticationFormStore.formContent
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleForgotPassword = this._handleForgotPassword.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
    this.handleTwitterClick = this._handleTwitterClick.bind(this)
    this.showSignupForm = this._showSignupForm.bind(this)
  }

  // can't disable button because safari :'(
  // http://stackoverflow.com/questions/11708092/detecting-browser-autofill/
  render() {
    return (
      <div className="flex flex-center">
        <div className="flex-none sm-col-4 mx-auto py4">
          <img className="flex-none" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Log in</h1>
          <Button size="big"
            bg="twitter-blue"
            block
            action={this.handleTwitterClick}>
            <Icon icon="twitter" />
            <span className="ml2">Use Twitter</span>
          </Button>

          <div className="mt2">
            <div className="border border-silver rounded p2">
              <AuthenticationFormError>
                <div>
                  <a href="javascript:void(0);"
                    className="underline white"
                    onClick={this.showSignupForm}>
                    Need to sign up?
                  </a>
                </div>
              </AuthenticationFormError>
              <form className="clearfix">
                <div className="py1">
                  <label className="left bold" htmlFor="login-username">Username or email</label>
                  <input autoFocus={!onMobile()}
                    type="text"
                    id="login-username"
                    ref="username"
                    className="block full-width field-light"
                    placeholder="jane"
                    onChange={this.handleChange('username')}
                    value={this.props.username} />
                </div>

                <div className="py1">
                  <label className="left bold block" htmlFor="login-password">Password</label>
                  <input type="password"
                    id="login-password"
                    ref="password"
                    className="block full-width field-light"
                    onChange={this.handleChange('password')}
                    value={this.props.password} />
                  <small className="left">
                    <a href="javascript:void(0)"
                      className="darken-4 underline"
                      onClick={this.handleForgotPassword}>
                      Forgot password?
                    </a>
                  </small>
                </div>

                <div className="py2 mt2">
                  <AuthenticationFormButton action={this.handleSubmit}>
                    Log in
                  </AuthenticationFormButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleChange(prop) {
    return (e) => {
      AuthenticationFormActions.change(Map(this.props).set(prop, e.target.value))
    }
  }

  _handleForgotPassword(e) {
    SigninScrimActions.show(PasswordResetEmailForm)
  }

  _handleSubmit(e) {
    e.preventDefault()

    // we need this check in case the user has autofilled the sign-in form
    let data = this.props
    if (!data.username ||
        !data.password) {
      data.username = React.findDOMNode(this.refs.username).value
      data.password = React.findDOMNode(this.refs.password).value
    }

    AuthenticationFormActions.submit('login', data)
  }

  _handleTwitterClick(e) {
    e.preventDefault()

    const { redirectTo } = this.props
    const opts = redirectTo ? { redirectTo } : {}

    TwitterActions.signIn(opts)
  }

  _showSignupForm(e) {
    SigninScrimActions.initialize(SignupForm, {})
  }
}

LoginForm.propTypes = {
  password: React.PropTypes.string,
  redirectTo: React.PropTypes.string,
  username: React.PropTypes.string
}
