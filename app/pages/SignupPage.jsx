import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'

export default class SignupPage extends React.Component {
  componentDidMount() {
    let returnUrl = RouterContainer.router.getCurrentQuery().return_path || '/dashboard'
    SigninScrimActions.show(SignupForm, returnUrl)
  }
  render() {
    return (
      <DocumentTitle title="Login" />
    )
  }
}
