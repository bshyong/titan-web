import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import AuthenticationFormError from 'components/Authentication/AuthenticationFormError.jsx'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import AvailableUsernameInput from 'components/Authentication/AvailableUsernameInput.jsx'
import Button from 'ui/Button.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import React from 'react'
import SessionActions from 'actions/SessionActions'

@connectToStores(AuthenticationFormStore)
export default class SignupForm extends React.Component {
  static getPropsFromStores() {
    return { shown: AuthenticationFormStore.shown, ...AuthenticationFormStore.formContent }
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
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
      username
    } = this.props

    return (
      <div>
        <div className="border border-silver rounded p2">
          <AuthenticationFormError />
          <form>
            <div className="py1">
              <label className="left bold" htmlFor="signup-email">Email</label>
              <AvailableUsernameInput autoFocus
                type="email"
                id="signup-email"
                className="block full-width field-light"
                placeholder="jane@example.com"
                value={email}
                onChange={this.handleChange('email')} />
            </div>

            <div className="py1">
              <label className="left bold" htmlFor="signup-username">Username</label>
              <AvailableUsernameInput type="text"
                id="signup-username"
                className="block full-width field-light"
                placeholder="jane"
                value={username}
                onChange={this.handleChange('username')}  />
            </div>

            <div className="py1">
              <label className="left bold" htmlFor="signup-password">Password</label>
              <input type="password"
                id="signup-password"
                className="block full-width field-light"
                value={password}
                onChange={this.handleChange('password')} />
              <small className="gray left">8 characters minimum</small>
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
            onClick={SessionActions.initializeTwitterSignIn}>
            Sign up using Twitter instead
          </a>
        </div>
      </div>
    )
  }

  renderTwitterButton() {
    return (
      <div>
        <Button size="big" bg="twitter-blue" block
          action={SessionActions.initializeTwitterSignIn}>
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
            onClick={AuthenticationFormActions.show}>
            Sign up with your email instead
          </a>
        </div>
      </div>
    )
  }

  isButtonDisabled() {
    const { email, password, username } = this.props
    return !email || !password || !username
  }

  _handleChange(prop) {
    return (e) => {
      AuthenticationFormActions.change(Map(this.props).set(prop, e.target.value))
    }
  }

  _handleSubmit(e) {
    e.preventDefault()

    AuthenticationFormActions.submit('register', AuthenticationFormStore.formContent)
  }
}

SignupForm.propTypes = {
  email: React.PropTypes.string,
  password: React.PropTypes.string,
  shown: React.PropTypes.bool,
  username: React.PropTypes.string
}
