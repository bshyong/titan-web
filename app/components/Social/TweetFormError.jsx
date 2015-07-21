import { connect } from 'redux/react'
import { authenticate, dismissError } from 'actions/TweetFormActions'
import Button from 'ui/Button.jsx'
import Icon from 'ui/Icon.jsx'
import React, { Component, PropTypes } from 'react'

@connect(state => ({
  error: state.tweetForm.error
}))
export default class TweetFormError extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.shape({
      location: PropTypes.string,
      message: PropTypes.string
    })
  }

  constructor(props) {
    super(props)

    this.handleAuthenticate = this._handleAuthenticate.bind(this)
    this.handleClose = this._handleClose.bind(this)
  }

  render() {
    const { children, error } = this.props
    if (error) {
      return (
        <div className="white bg-red rounded">
          <div className="right mr1 mt1">
            <a href="javascript:void(0);"
              className="white"
              onClick={this.handleClose}>
              <Icon icon="close" />
            </a>
          </div>

          <div className="p2">
            Something went wrong! Have you tried{' '}
            <a href="javascript:void(0)"
              className="underline white"
              onClick={this.handleAuthenticate}>
              authenticating with Twitter
            </a>?
            <div>
              {error.message}
              {children}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  _handleAuthenticate() {
    this.props.dispatch(authenticate(this.props.error.location))
  }

  _handleClose(e) {
    this.props.dispatch(dismissError())
  }
}
