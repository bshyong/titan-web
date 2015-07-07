import DocumentTitle from 'react-document-title'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import React from 'react'
import SigninScrimActions from 'actions/SigninScrimActions'

export default class LoginPage extends React.Component {
  componentDidMount() {
    SigninScrimActions.show(LoginForm, '/dashboard')
  }
  render() {
    return (
      <DocumentTitle title="Login" />
    )
  }
}
