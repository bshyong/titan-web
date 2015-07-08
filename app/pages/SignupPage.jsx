import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'

export default class SignupPage extends React.Component {
  componentDidMount() {
    const redirectTo = (
      RouterContainer.router.getCurrentQuery().redirectTo || '/dashboard'
    )
    SigninScrimActions.show(SignupForm, redirectTo)
  }

  render() {
    return (
      <DocumentTitle title="Login" />
    )
  }
}
