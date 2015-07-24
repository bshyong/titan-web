import AuthenticationForm from 'components/Authentication/AuthenticationForm.jsx'
import AuthenticationFormToggler from 'components/Authentication/AuthenticationFormToggler.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import React from 'react'
import Scrim from 'ui/Scrim.jsx'
import SigninScrimStore from 'stores/SigninScrimStore'

@connectToStores(SigninScrimStore)
export default class SigninScrim extends React.Component {
  static getPropsFromStores() {
    return { shown: SigninScrimStore.shown }
  }

  static propTypes = {
    shown: React.PropTypes.bool
  }

  render() {
    const { shown } = this.props

    if (!shown) {
      return null
    }

    return (
      <Scrim>
        <div className="clearfix p3">
          <div className="sm-col-right">
            <AuthenticationFormToggler />
          </div>
        </div>

        <AuthenticationForm />
      </Scrim>
    )
  }
}
