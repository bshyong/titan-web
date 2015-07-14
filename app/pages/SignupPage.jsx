import AuthenticationForm from 'components/Authentication/AuthenticationForm.jsx'
import AuthenticationFormToggler from 'components/Authentication/AuthenticationFormToggler.jsx'
import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from 'lib/router_container'

export default class SignupPage extends React.Component {
  render() {
    return (
      <div className="center">
        <DocumentTitle title="Login" />
        <div className="clearfix p3">
          <div className="sm-col-right">
            <AuthenticationFormToggler closeable={false} />
          </div>
        </div>
        <AuthenticationForm formComponent="signup"
          redirectTo={
            RouterContainer.router.getCurrentQuery().redirectTo || '/dashboard'
          } />
      </div>
    )
  }
}
