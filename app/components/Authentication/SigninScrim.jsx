import Button from 'ui/Button.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import PasswordResetEmailForm from 'components/Authentication/PasswordResetEmailForm.jsx'
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
    const { Form } = this.props
    if (Form === LoginForm || Form === PasswordResetEmailForm) {
      return (
        <div className="h4">
          Don't have an account?{' '}
          <a href="javascript:void(0)"
            onClick={SigninScrimActions.show.bind(null, SignupForm)}>
            Sign up
          </a>.
          <span className="gray ml2 pointer right relative"
            onClick={this.handleClose}
            style={{ fontSize: '2rem', top: -12 }}>
            <Icon icon="close" />
          </span>
        </div>
      )
    } else if (Form === SignupConfirmationForm) {
      return null
    }

    return (
      <div className="h4">
        Have an account?{' '}
        <a href="javascript:void(0)"
          onClick={SigninScrimActions.show.bind(null, LoginForm)}>
          Log in
        </a>.
        <span className="gray ml2 pointer right relative"
          onClick={this.handleClose}
          style={{ fontSize: '2rem', top: -12 }}>
          <Icon icon="close" />
        </span>
      </div>
    )
  }
}

SigninScrim.propTypes = {
  shown: React.PropTypes.bool
}
