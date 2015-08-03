import { connect } from 'redux/react'
import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import Avatar from 'ui/Avatar.jsx'
import Button from 'ui/Button.jsx'
import MarkdownArea from 'ui/MarkdownArea.jsx'
import React from 'react'

@connect(() => ({}))
export default class CommentForm extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    defaultValue: React.PropTypes.string,
    onPublish: React.PropTypes.func.isRequired,
    showAvatar: React.PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      body: props.defaultValue || '',
    }

    this.handleOnChange = this._handleOnChange.bind(this)
    this.handleOnPublish = this._handleOnPublish.bind(this)
    this.handleSignInClick = this._handleSignInClick.bind(this)
  }

  renderButton() {
    const valid = this.state.body.length > 0
    if (!valid) {
      return null
    }
    return (
      <div className="mt2">
        <Button action={this.handleOnPublish}>
          {this.props.id ? 'Update' : 'Post your thoughts'}
        </Button>
      </div>
    )
  }

  renderTextArea() {
    return (
      <MarkdownArea
        id={this.props.storyId}
        ref="comment"
        placeholder="What do you think?"
        onChange={this.handleOnChange}
        onCmdEnter={this.handleOnPublish}
        value={this.state.body}
        rows={1} />
    )
  }

  render() {
    if (!this.props.user.id) {
      return (
        <div className="pointer">
          <a onClick={this.handleSignInClick} >
            Log in to comment
          </a>
        </div>
      )
    }

    return (
      <div className="flex">
        {this.props.showAvatar ? this.renderAvatar() : null}
        <div className="flex-auto">
          {this.renderTextArea()}
          {this.renderButton()}
        </div>
      </div>
    )
  }

  renderAvatar() {
    if (!this.props.id) {
      return (
        <div className="flex-none mr2 py1" style={{marginTop: 2, marginBottom: 2}}>
          <Avatar user={this.props.user} size={24} />
        </div>
      )
    }
  }

  _handleOnPublish() {
    const valid = this.state.body.length > 0
    if (!valid) {
      return null
    }

    this.props.onPublish(this.state.body)
    this.setState({body: ''})
  }

  _handleOnChange(e) {
    this.setState({
      body: e.target.value,
    })
  }

  _handleSignInClick() {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'login',
      formContent: { redirectTo: window.location.pathname },
    }))
  }
}
