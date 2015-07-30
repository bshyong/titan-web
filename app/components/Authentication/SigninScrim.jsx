import AuthenticationForm from 'components/Authentication/AuthenticationForm.jsx'
import AuthenticationFormToggler from 'components/Authentication/AuthenticationFormToggler.jsx'
import React from 'react'
import Scrim from 'ui/Scrim.jsx'
import {connect} from 'redux/react'

@connect(state => ({
  shown: state.signinScrim.shown,
}))
export default class SigninScrim extends React.Component {
  static propTypes = {
    shown: React.PropTypes.bool,
  }

  render() {
    console.log('shown', this.props)
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
