import * as AuthenticationFormActions from 'actions/AuthenticationFormActions'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import PasswordResetForm from 'components/Authentication/PasswordResetForm.jsx'
import PasswordResetEmailForm from 'components/Authentication/PasswordResetEmailForm.jsx'
import React from 'react'
import SignupForm from 'components/Authentication/SignupForm.jsx'
import SignupConfirmationForm from 'components/Authentication/SignupConfirmationForm.jsx'

const formComponents = {
  login: LoginForm,
  passwordReset: PasswordResetForm,
  passwordResetEmail: PasswordResetEmailForm,
  signup: SignupForm,
  signupConfirmation: SignupConfirmationForm
}

@connect(state => ({
  formComponent: state.authenticationForm.get('formComponent'),
  formContent: state.authenticationForm.get('formContent').toJS(),
  shown: state.authenticationForm.get('shown'),
  token: state.authenticationForm.get('token')
}))
export default class AuthenticationForm extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    formComponent: React.PropTypes.oneOf([
      'login',
      'passwordReset',
      'passwordResetEmail',
      'signup',
      'signupConfirmation'
    ]),
    formContent: React.PropTypes.shape({
      email: React.PropTypes.string,
      password: React.PropTypes.string,
      redirectTo: React.PropTypes.string,
      username: React.PropTypes.string
    }),
    shown: React.PropTypes.bool,
    token: React.PropTypes.string
  }

  render() {
    const Form = formComponents[this.props.formComponent]

    return <Form {...this.props}
      {...bindActionCreators(AuthenticationFormActions, this.props.dispatch)} />
  }
}
