import PasswordResetForm from 'components/Authentication/PasswordResetForm.jsx'
import React from 'react'
import SigninScrimActions from 'actions/SigninScrimActions'

export default class PasswordResetPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    SigninScrimActions.initialize(PasswordResetForm, { token: query.token })
  }

  render() {
    return (
      <div>
        Redirecting...
      </div>
    )
  }
}
