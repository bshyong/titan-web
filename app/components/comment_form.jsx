import Avatar from 'components/ui/avatar.jsx'
import Button from 'components/ui/button.js.jsx'
import CommentFormActions from 'actions/comment_form_actions'
import DropzoneContainer from 'components/dropzone_container.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import NewCommentsStore from 'stores/new_comments_store'
import React from 'react'
import SessionStore from 'stores/session_store'

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: NewCommentsStore.get(this.props.storyId),
      formOpen: false,
      user: SessionStore.user,
      isSignedIn: SessionStore.isSignedIn()
    }

    this.handleUploaded = this._handleUploaded.bind(this)
    this.handleUploading = this._handleUploading.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
    this.handleOnPublish = this._handleOnPublish.bind(this)
    this.handleFormFocus = this._handleFormFocus.bind(this)
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    NewCommentsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    NewCommentsStore.removeChangeListener(this.onStoreChange)
  }

  renderButton() {
    const valid = NewCommentsStore.isValid(this.props.storyId)
    if (valid && this.state.formOpen) {
      return (
        <Button
          bg="navy"
          text="white"
          block={true}
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
        <DropzoneContainer id={this.props.storyId}
            onUploaded={this.handleUploaded}
            onUploading={this.handleUploading}>
          <MarkdownArea
            ref="comment"
            placeholder={placeholder}
            onChange={this.handleOnChange}
            value={this.state.comment}
            onBlur={this.handleFormFocus} />
        </DropzoneContainer>
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

  _handleUploaded(oldText, fileText) {
    // next tick
    setTimeout(() => {
      let value = React.findDOMNode(this.refs.comment).value


      CommentFormActions.change(
        this.props.storyId,
        value.replace(oldText, fileText)
      )
    }, 0)
  }

  _handleUploading(fileText) {
    // next tick
    setTimeout(() => {
      CommentFormActions.change(
        this.props.storyId,
        `${React.findDOMNode(this.refs.comment).value} ${fileText}`
      )
    }, 0)
  }

  _onStoreChange() {
    this.setState({
      comment: NewCommentsStore.get(this.props.storyId) || ''
    })
  }
}
