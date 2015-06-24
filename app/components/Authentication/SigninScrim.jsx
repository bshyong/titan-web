import Button from 'ui/Button.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import React from 'react'
import Scrim from 'ui/Scrim.jsx'
import SessionActions from 'actions/SessionActions'
import SigninScrimActions from 'actions/SigninScrimActions'
import SigninScrimStore from 'stores/SigninScrimStore'
import SignupConfirmationForm from 'components/Authentication/SignupConfirmationForm.jsx'
import SignupForm from 'components/Authentication/SignupForm.jsx'

@connectToStores(SigninScrimStore)
export default class SigninScrim extends React.Component {
  static getPropsFromStores() {
    return SigninScrimStore.state
  }

  render() {
    const { Form, shown } = this.props

    return (
      <Scrim shown={shown}>
        <div className="clearfix p3">
          <div className="sm-col-right">
            {this.renderFormToggle()}
          </div>
        </div>

        {Form ? <Form /> : this.props.children}
      </Scrim>
    )
  }

  handleClose(e) {
    SigninScrimActions.hide()
  }

  renderFormToggle() {
    if (this.props.Form === LoginForm) {
      return [
        <small key="signup-form-text">
          Don't have an account?{' '}
          <a href="javascript:void(0)"
            onClick={SigninScrimActions.show.bind(null, SignupForm)}>
            Sign up
          </a>.
        </small>,
        <span className="gray ml2 pointer right"
          onClick={this.handleClose}
          key="sign-up-form-icon">
          <Icon icon="close" />
        </span>
      ]
    } else if (this.props.Form === SignupConfirmationForm) {
      return null
    }

    return [
      <small key="signup-form-text">
        Have an account?{' '}
        <a href="javascript:void(0)"
          onClick={SigninScrimActions.show.bind(null, LoginForm)}>
          Log in
        </a>.
      </small>,
      <span className="gray ml2 pointer right"
        onClick={this.handleClose}
        key="sign-up-form-icon">
        <Icon icon="close" />
      </span>
    ]
  }
}

SigninScrim.propTypes = {
  shown: React.PropTypes.bool
}
