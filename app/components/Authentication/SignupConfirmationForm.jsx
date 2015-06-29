import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import AvailableUsernameInput from 'components/Authentication/AvailableUsernameInput.jsx'
import Button from 'ui/Button.jsx'
import classnames from 'classnames'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import LogoSrc from 'images/logo.svg'
import { Map } from 'immutable'
import React from 'react'
import SessionActions from 'actions/SessionActions'

@connectToStores(AuthenticationFormStore)
export default class SignupConfirmationForm extends React.Component {
  static getPropsFromStores() {
    return AuthenticationFormStore.formContent
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
  }

  render() {
    const {
      email,
      username
    } = this.props

    return (
      <div className="flex flex-center">
        <div className="flex-none col-4 mx-auto py4">
          <img className="flex-none mr2" src={LogoSrc} style={{height: '1.5rem'}} />
          <h1 className="mt0">Complete signup</h1>

          <div className="mt2">
            <div className="border border-silver rounded p2">
              <form>
                <div className="py1">
                  <label className="left bold" htmlFor="confirmation-email">Email</label>
                  <AvailableUsernameInput type="email"
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
                  <Button size="big"
                    color="black bg-darken-2"
                    block
                    action={this.handleSubmit}>
                    Done
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="h6 mt3 gray">
            By signing up, you agree to Assembly's
            {' '}
            <a href="https://assembly.com/terms"
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

  _handleChange(prop) {
    return (e) => {
      AuthenticationFormActions.change(Map(this.props).set(prop, e.target.value))
    }
  }

  _handleSubmit(e) {
    e.preventDefault()

    AuthenticationFormActions.submit('auth/confirm', this.props)
  }
}

SignupConfirmationForm.propTypes = {
  email: React.PropTypes.string,
  // for finishing up Twitter login
  provider: React.PropTypes.string,
  // for finishing up Twitter login
  uid: React.PropTypes.string,
  username: React.PropTypes.string
}
