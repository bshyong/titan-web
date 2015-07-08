import Button from 'ui/Button.jsx'
import React from 'react'

export default class AuthenticationFormButton extends React.Component {
  render() {
    return <Button size="big"
      bg="smoke"
      color="black"
      block
      {...this.props} />
  }
}
