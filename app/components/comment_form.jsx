import React from 'react'
import Avatar from 'components/ui/avatar.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import Button from 'components/ui/button.js.jsx'
import CommentFormActions from 'actions/comment_form_actions'
import SessionStore from 'stores/session_store'
import NewCommentsStore from 'stores/new_comments_store'

export default class CommentForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      comment: NewCommentsStore.get(this.props.storyId),
      formOpen: false,
      user: SessionStore.user,
      isSignedIn: SessionStore.isSignedIn()
    }

    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
    this.handleOnPublish = this._handleOnPublish.bind(this)
    this.handleFormFocus = this._handleFormFocus.bind(this)
  }

  componentDidMount() {
    NewCommentsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    NewCommentsStore.removeChangeListener(this.onStoreChange)
  }

  renderButton() {
    const valid = NewCommentsStore.valid(this.props.storyId)
    if (valid && this.state.formOpen) {
      return (
        <Button
          bg="navy"
          text="white"
          block={true}
          disabled={!(valid && this.state.comment.length > 2)}
          action={this.handleOnPublish}>
            Post your thoughts
        </Button>
      )
    } else {
      return <div />
    }
  }

  renderTextArea() {
    const placeholder = "What do you think of this story?"

    if (this.state.formOpen) {
      return (
        <MarkdownArea
          ref="comment"
          placeholder={placeholder}
          onChange={this.handleOnChange}
          value={this.state.comment}
          onBlur={this.handleFormFocus} />
      )
    } else {
      return (
        <textarea
          ref="blank_comment"
          placeholder={placeholder}
          className="field-light mb0 block full-width"
          style={{height: '44px'}}
          onFocus={this.handleFormFocus} />
      )
    }
  }

  _handleFormFocus() {
    const open = React.findDOMNode(this.refs.comment)
    this.setState({
      formOpen: !open || this.state.comment
    }, () => {React.findDOMNode(this.refs.comment).focus()})
  }

  render() {
    if (!this.state.isSignedIn) {
      return <div />
    }

    const { user } = this.state

    return (
      <div className="flex">
        <div className="flex-none mr2">
          <Avatar user={user} size={24} />
        </div>
        <div className="flex-auto">
          <div className="mb2">
            {this.renderTextArea()}
          </div>
          {this.renderButton()}
        </div>
      </div>
    )
  }

  _handleOnPublish() {
    CommentFormActions.publish(
      this.props.changelogId,
      this.props.storyId,
      this.state.comment
    )
  }

  _handleOnChange() {
    CommentFormActions.change(
      this.props.storyId,
      React.findDOMNode(this.refs.comment).value
    )
  }

  _onStoreChange() {
    this.setState({
      comment: NewCommentsStore.get(this.props.storyId) || ''
    })
  }
}
