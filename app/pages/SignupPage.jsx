import { connect } from 'redux/react'
import DocumentTitle from 'react-document-title'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import PasswordResetEmailForm from 'components/Authentication/PasswordResetEmailForm.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SignupForm from 'components/Authentication/SignupForm.jsx'
import * as signupPageActions from 'actions/signupPageActions'

@connect(state => {
  return {
    Form: state.signupPage.Form
  }
})
export default class SignupPage extends React.Component {
  render() {
    const { dispatch, Form } = this.props
    const RenderedForm = Form ? Form : SignupForm
    return (
      <div className="center">
        <DocumentTitle title="Login" />
        <div className="clearfix p3">
          <div className="sm-col-right">
            {this.renderFormToggle(dispatch)}
          </div>
        </div>
        <RenderedForm redirectTo={RouterContainer.router.getCurrentQuery().redirectTo || '/dashboard'} />
      </div>
    )
  }

  renderFormToggle(dispatch) {
    const { Form } = this.props
    const { changeForm } = signupPageActions
    if (Form === LoginForm || Form === PasswordResetEmailForm) {
      return (
        <div className="h4">
          Don&#39;t have an account?{' '}
          <a href="javascript:void(0)"
            className="underline-hover"
            onClick={dispatch.bind(dispatch, changeForm(SignupForm))}>
            Sign up
          </a>.
        </div>
      )
    }

    return (
      <div className="h4">
        Have an account?{' '}
        <a href="javascript:void(0)"
          className="underline-hover"
          onClick={dispatch.bind(dispatch, changeForm(LoginForm))}>
          Log in
        </a>.
      </div>
    )
  }
}
