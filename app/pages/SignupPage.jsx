import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SigninScrim from 'components/Authentication/SigninScrim.jsx'
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
      <div>
        <DocumentTitle title="Login" />
        <SigninScrim Form={SignupForm}
          shown={true}
          redirecTo={RouterContainer.router.getCurrentQuery().redirectTo || '/dashboard'} />
      </div>
    )
  }
}
