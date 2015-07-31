import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import Icon from 'ui/Icon.jsx'
import React from 'react'
import * as signinScrimActions from 'actions/signinScrimActions'

// be sure to bind this function
// to the right context, e.g.,
// renderToggleLink.call(this, ...)
function renderToggleLink(prompt, formComponent, linkText) {
  const {
    changeForm,
    closeable,
    formContent,
  } = this.props

  return (
    <div className="h4">
      {`${prompt} `}
      <a className="underline-hover pointer"
        onClick={changeForm.bind(changeForm, {
          closeable: closeable,
          formComponent: formComponent,
          formContent: formContent,
        })}>
        {linkText}
      </a>.
      {closeable && this.renderCloser()}
    </div>
  )
}

class GenericToggler extends React.Component {
  renderCloser() {
    return (
      <span className="gray ml2 pointer right relative"
        onClick={this.handleClick}
        style={{ fontSize: '2rem', top: -12 }}>
        <Icon icon="close" />
      </span>
    )
  }

  handleClick = () => {
    this.props.dispatch(signinScrimActions.hide())
  }
}

@connect(() => ({}))
class Login extends GenericToggler {
  static defaultProps = {
    closeable: true,
  }

  static propTypes = {
    changeForm: React.PropTypes.func.isRequired,
    closeable: React.PropTypes.bool,
  }

  render() {
    return renderToggleLink.call(this, 'Have an account?', 'login', 'Log in')
  }
}

@connect(() => ({}))
class Signup extends GenericToggler {
  static defaultProps = {
    closeable: true,
  }

  static propTypes = {
    changeForm: React.PropTypes.func.isRequired,
    closeable: React.PropTypes.bool,
  }

  render() {
    return renderToggleLink.call(this, "Don't have an account?", 'signup', 'Sign up')
  }
}

// this map is a bit confusing, but it just means to say
// that when the state's `formComponent` is, e.g., `'login'`,
// this component should show the Signup toggle (because the user
// might want to change to the SignupForm)
const togglers = {
  login: Signup,
  passwordResetEmail: Signup,
  signup: Login,
}

@connect(state => {
  return {
    closeable: state.authenticationForm.get('closeable'),
    formComponent: state.authenticationForm.get('formComponent'),
    formContent: state.authenticationForm.get('formContent'),
  }
})
export default class AuthenticationToggler extends React.Component {
  static propTypes = {
    closeable: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
    formComponent: React.PropTypes.string,
  }

  render() {
    const { dispatch, formComponent } = this.props
    const Toggler = togglers[formComponent]

    if (Toggler) {
      return <Toggler {...this.props}
        {...bindActionCreators(AuthenticationFormActions, dispatch)} />
    }

    return null
  }
}
