import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import Comment from '../components/comment.jsx'
import CommentFormActions from '../actions/comment_form_actions'
import MarkdownArea from '../ui/markdown_area.jsx'
import NewCommentsStore from '../stores/new_comments_store'
import React from 'react'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props)

    if (props.id) {
      this.state = {
        comment: props.body
      }
    } else {
      this.state = {
        comment: NewCommentsStore.get(this.props.storyId)
      }
    }

    this.state.isFocused = false
    this.state.user = SessionStore.user
    this.state.isSignedIn = SessionStore.isSignedIn()

    this.handleOnChange = this._handleOnChange.bind(this)
    this.handleOnPublish = this._handleOnPublish.bind(this)
    this.handleToggleFocus = this._handleToggleFocus.bind(this)
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    NewCommentsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    NewCommentsStore.removeChangeListener(this.onStoreChange)
  }

  renderButton() {
    const valid = NewCommentsStore.isValid(this.props.id || this.props.storyId)
    if (!valid) {
      return
    }
    return (
      <div className="mt2">
        <Button action={this.handleOnPublish}>
          {this.props.id ? 'Update' : 'Post your thoughts'}
        </Button>
      </div>
    )
  }

  renderOptimisticComment() {
    const comment = {
      body: this.state.comment,
      user: this.state.user,
    }
    return <Comment comment={comment} />
  }

  renderTextArea() {
    return (
      <MarkdownArea
        id={this.props.storyId}
        ref="comment"
        placeholder="What do you think?"
        onChange={this.handleOnChange}
        onCmdEnter={this.handleOnPublish}
        value={this.state.comment}
        rows={1} />
    )
  }

  _handleToggleFocus() {
    this.setState({ isFocused: !this.state.isFocused })
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div className="pointer">
          <a onClick={SessionActions.signin} >
            Sign in to comment
          </a>
        </div>
      )
    }

    const { user } = this.state

    if (this.state.isSaving) {
      return this.renderOptimisticComment()
    } else {
      return (
        <div className="flex">
          {this.renderAvatar()}
          <div className="flex-auto">
            {this.renderTextArea()}
            {this.renderButton()}
          </div>
        </div>
      )
    }
  }

  renderAvatar() {
    if (!this.props.id) {
      return (
        <div className="flex-none mr2 py1" style={{marginTop: 2, marginBottom: 2}}>
          <Avatar user={this.state.user} size={24} />
        </div>
      )
    }
  }

  _handleOnPublish() {
    if (!NewCommentsStore.isValid(this.props.id || this.props.storyId)) {
      return
    }

    if (this.props.id) {
      CommentFormActions.update(
        this.props.changelogId,
        this.props.storyId,
        this.props.id,
        this.state.comment
      )
    } else {
      CommentFormActions.publish(
        this.props.changelogId,
        this.props.storyId,
        this.state.comment
      )
    }
  }

  _handleOnChange(e) {
    CommentFormActions.change(
      this.props.id || this.props.storyId,
      e.target.value
    )
  }

  _onStoreChange() {
    this.setState({
      isSaving: NewCommentsStore.isSaving(this.props.id || this.props.storyId),
      comment: NewCommentsStore.get(this.props.id || this.props.storyId) || ''
    })
  }
}
