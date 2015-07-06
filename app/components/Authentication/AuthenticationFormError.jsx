import AuthenticationFormActions from 'actions/AuthenticationFormActions'
import AuthenticationFormStore from 'stores/AuthenticationFormStore'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import React from 'react'

@connectToStores(AuthenticationFormStore)
export default class LoginForm extends React.Component {
  static getPropsFromStores() {
    return { error: AuthenticationFormStore.error }
  }

  constructor(props) {
    super(props)

    this.handleClick = this._handleClick.bind(this)
  }

  render() {
    const { children, error } = this.props

    if (error) {
      return (
        <div className="white bg-red rounded">
          <div className="right mr1 mt1">
            <a href="javascript:void(0);"
              className="white"
              onClick={this.handleClick}>
              <Icon icon="close" />
            </a>
          </div>

          <div className="p2">
            Something went wrong!
            <div className="h5">
              {error}
              {children}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  _handleClick(e) {
    AuthenticationFormActions.dismissError()
  }
}
