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
      isFocused: false,
      user: SessionStore.user,
      isSignedIn: SessionStore.isSignedIn()
    }

    this.handleUploaded = this._handleUploaded.bind(this)
    this.handleUploading = this._handleUploading.bind(this)
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
    const valid = NewCommentsStore.isValid(this.props.storyId)
    if (!valid) {
      return
    }
    return (
      <div className="mt2">
        <Button
          bg="navy"
          text="white"
          action={this.handleOnPublish}>
            Post your thoughts
        </Button>
      </div>
    )
  }

  renderTextArea() {
    return (
      <DropzoneContainer id={this.props.storyId}
          onUploaded={this.handleUploaded}
          onUploading={this.handleUploading}>
        <MarkdownArea
          ref="comment"
          placeholder="What do you think?"
          onChange={this.handleOnChange}
          value={this.state.comment}
          rows={(this.state.isFocused || NewCommentsStore.isValid(this.props.storyId)) ? 2 : 1}
          onBlur={this.handleToggleFocus}
          onFocus={this.handleToggleFocus} />
      </DropzoneContainer>
    )
  }

  _handleToggleFocus() {
    this.setState({ isFocused: !this.state.isFocused })
  }

  render() {
    if (!this.state.isSignedIn) {
      return <div />
    }

    const { user } = this.state

    return (
      <div className="flex">
        <div className="flex-none py1 mr2" style={{marginTop: 2, marginBottom: 2}}>
          <Avatar user={user} size={24} />
        </div>
        <div className="flex-auto">
          {this.renderTextArea()}
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
