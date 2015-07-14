import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormButton from 'components/Authentication/AuthenticationFormButton.jsx'
import AvailableUsernameInput from 'components/Authentication/AvailableUsernameInput.jsx'
import Button from 'ui/Button.jsx'
import classnames from 'classnames'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import React from 'react'

export default class SignupConfirmationForm extends React.Component {
  static propTypes =  {
    change: React.PropTypes.func.isRequired,
    changeForm: React.PropTypes.func.isRequired,
    formContent: React.PropTypes.shape({
      email: React.PropTypes.string,
      // for finishing up Twitter login
      provider: React.PropTypes.string,
      // for finishing up Twitter login
      uid: React.PropTypes.string,
      username: React.PropTypes.string
    }),
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSignInClick = this._handleSignInClick.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
  }

  render() {
    const {
      email,
      username
    } = this.props.formContent

    return (
      <div className="flex flex-center">
        <div className="flex-none sm-col-4 mx-auto py4">
          <img className="flex-none" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Complete signup</h1>

          <div className="mt2">
            <div className="border border-silver rounded p2">
              <h5 className="mt0">
                Already have an account?
                {' '}<a href="javascript:void(0)"
                  onClick={this.handleSignInClick}>
                  Sign in
                </a> and connect to Twitter through your /settings page.
              </h5>
              <form>
                <div className="py1">
                  <label className="left bold" htmlFor="confirmation-email">Email</label>
                  <AvailableUsernameInput autoFocus
                    type="email"
                    id="confirmation-email"
                    className="block full-width field-light"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={this.handleChange('email')} />
                </div>

                <div className="py1">
                  <label className="left bold" htmlFor="confirmation-username">Username</label>
                  <AvailableUsernameInput type="text"
                    id="confirmation-username"
                    className="block full-width field-light"
                    placeholder="jane"
                    value={username}
                    onChange={this.handleChange('username')} />
                </div>

                <div className="py2 mt2">
                  <AuthenticationFormButton action={this.handleSubmit} disabled={this.isButtonDisabled()}>
                    Done
                  </AuthenticationFormButton>
                </div>
              </form>
            </div>
          </div>

          <div className="h6 mt3 gray">
            By signing up, you agree to Assembly's
            {' '}
            <a href="/terms"
              className="gray underline"
              target="_blank">
              Terms of Service
            </a>.
            <br />
            We will never post to Twitter unless you ask us to.
          </div>
        </div>
      </div>
    )
  }

  isButtonDisabled() {
    const { email, username } = this.props.formContent
    return !email || !username
  }

  _handleChange(prop) {
    return (e) => {
      this.props.change(Map(this.props.formContent).set(prop, e.target.value))
    }
  }

  _handleSignInClick(e) {
    e.preventDefault()

    this.props.changeForm({
      formComponent: 'login',
      formContent: { ...this.props.formContent, redirectTo: '/settings' }
    })
  }

  _handleSubmit(e) {
    e.preventDefault()

    this.props.submit('auth/twitter/confirm', this.props.formContent)
  }
}
