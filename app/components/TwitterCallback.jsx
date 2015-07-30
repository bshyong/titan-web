import AuthenticationForm from 'components/Authentication/AuthenticationForm.jsx'
import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import { connect } from 'redux/react'
import { Map } from 'immutable'
import querystring from 'querystring'
import React from 'react'
import statics from 'lib/statics'
import TwitterActions from 'actions/oauth/TwitterActions'

@connect(state => ({
  username: state.authenticationForm.getIn(['formContent', 'username'])
}))
export default class TwitterCallback extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      twitterAuthenticationAttempted: false
    }
  }
  componentWillMount() {
    const searchString = window.location.search.substr(1)
    const query = querystring.parse(searchString)

    TwitterActions.callback(query).then(() => {
      this.props.dispatch(AuthenticationFormActions.change(Map(query)))
      this.setState({ twitterAuthenticationAttempted: true })
    })
  }

  render() {
    const { twitterAuthenticationAttempted } = this.state

    return (
      <div className="p2 center">
        {twitterAuthenticationAttempted &&
         <AuthenticationForm formComponent="signupConfirmation" />}
      </div>
    )
  }
}
