import * as authenticationFormActions from 'actions/authenticationFormActions'
import { connect } from 'redux/react'
import Icon from 'ui/Icon.jsx'
import React from 'react'

@connect(state => ({
  error: state.authenticationForm.get('error'),
}))
export default class AuthenticationFormError extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    error: React.PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.handleClick = this._handleClick.bind(this)
  }

  render() {
    const { children, error } = this.props

    if (error && error.error) {
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
              {error.error}
              {children}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  _handleClick() {
    this.props.dispatch(authenticationFormActions.dismissError())
  }
}
