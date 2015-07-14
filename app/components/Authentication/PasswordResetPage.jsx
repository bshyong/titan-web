import AuthenticationForm from 'components/Authentication/AuthenticationForm.jsx'
import React from 'react'

export default class PasswordResetPage extends React.Component {
  render() {
    return <AuthenticationForm formComponent="passwordReset" />
  }
}
