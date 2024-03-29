import { Map } from 'immutable'
import {connect} from 'redux/react'
import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import AuthenticationFormError from 'components/Authentication/AuthenticationFormError.jsx'
import AvailableUsernameInput from 'components/Authentication/AvailableUsernameInput.jsx'
import Button from 'ui/Button.jsx'
import Icon from 'ui/Icon.jsx'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import LogoSrc from 'images/logo.svg'
import onMobile from 'lib/on_mobile'
import PasswordInputAndHelper from 'components/Authentication/PasswordInputAndHelper.jsx'
import React from 'react'
import * as signinScrimActions from 'actions/signinScrimActions'
import TwitterActions from 'actions/oauth/TwitterActions'

@connect(state => ({
  error: state.authenticationForm.get('error'),
}))
export default class SignupForm extends React.Component {
  static propTypes = {
    change: React.PropTypes.func.isRequired,
    changeForm: React.PropTypes.func.isRequired,
    formContent: React.PropTypes.shape({
      email: React.PropTypes.string,
      password: React.PropTypes.string,
      redirectTo: React.PropTypes.string,
      username: React.PropTypes.string,
    }),
    show: React.PropTypes.func.isRequired,
    shown: React.PropTypes.bool,
    submit: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleLoginClick = this._handleLoginClick.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
    this.handleTwitterClick = this._handleTwitterClick.bind(this)
  }

  render() {
    return (
      <div className="flex flex-center">
        <div className="flex-none sm-col-4 mx-auto py4">
          <img className="flex-none" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Sign up</h1>
          {this.props.shown ? this.renderForm() : this.renderTwitterButton()}
        </div>
      </div>
    )
  }

  renderForm() {
    const {
      email,
      password,
      username,
    } = this.props.formContent

    return (
      <div>
        <div className="border border-silver rounded p2">
          <AuthenticationFormError />
          <form>
            <div className="py1">
              <label className="left bold" htmlFor="signup-email">Email</label>
              <input autoFocus={!onMobile()}
                type="email"
                id="signup-email"
                className="block full-width field-light"
                placeholder="jane@example.com"
                value={email}
                onChange={this.handleChange('email')} />
              {this.renderError('email')}
            </div>

            <div className="py1">
              <label className="left bold" htmlFor="signup-username">Username</label>
              <AvailableUsernameInput type="text"
                id="signup-username"
                className="block full-width field-light"
                placeholder="jane"
                value={username}
                onChange={this.handleChange('username')} />
            </div>

            <div className="py1 mb4">
              <PasswordInputAndHelper value={password}
                onChange={this.handleChange('password')} />
            </div>

            <div className="py2 mt2">
              <AuthenticationFormButton action={this.handleSubmit} disabled={this.isButtonDisabled()}>
                Create account
              </AuthenticationFormButton>
            </div>
          </form>
        </div>
        <div className="h6 mt2 gray">
          By signing up, you agree to Assembly&#39;s
          {' '}
          <a href="/terms"
            className="gray underline"
            target="_blank">
            Terms of Service
          </a>.
        </div>
        <div className="mt4">
          <a href="javascript:void(0)"
            className="bold darken-4 gray-hover"
            onClick={this.handleTwitterClick}>
            Sign up using Twitter instead
          </a>
        </div>
      </div>
    )
  }

  renderError() {
    if (!(this.props.error && this.props.error.email)) {
      return null
    }
    return (
      <small className="red mt1">
        Email {this.props.error.email}
      </small>
    )
  }

  renderTwitterButton() {
    return (
      <div>
        <Button size="big" bg="twitter-blue" block
          action={this.handleTwitterClick}>
          <Icon icon="twitter" />
          <span className="ml2">Use Twitter</span>
        </Button>
        <div className="h6 mt2 gray">
          We will never post to Twitter unless you ask us to.
          <br />
          By signing up, you agree to Assembly&#39;s
          {' '}
          <a href="/terms"
            className="gray underline"
            target="_blank">
            Terms of Service
          </a>.
        </div>
        <div className="mt4">
          <a href="javascript:void(0)"
            className="bold darken-4 gray-hover"
            onClick={this.props.show}>
            Sign up with your email instead
          </a>
        </div>
        <h5 className="gray">
          ASM 1.0 members don't need to create a new account.
          Just <a href="javascript:void(0)" onClick={this.handleLoginClick}>login</a>.
        </h5>
      </div>
    )
  }

  isButtonDisabled() {
    const { email, password, username } = this.props.formContent
    return !email || !password || !username
  }

  _handleChange(prop) {
    return (e) => {
      this.props.change(
        Map(this.props.formContent).set(prop, e.target.value)
      )
    }
  }

  _handleLoginClick(e) {
    e.preventDefault()

    this.props.dispatch(signinScrimActions.show(LoginForm))
  }

  _handleSubmit(e) {
    e.preventDefault()

    this.props.submit(
      'register',
      this.props.formContent
    )
  }

  _handleTwitterClick(e) {
    e.preventDefault()

    const { redirectTo } = this.props
    const opts = redirectTo ? { redirectTo } : {}

    TwitterActions.signIn(opts)
  }
}
