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
      user: SessionStore.user,
      isSignedIn: SessionStore.isSignedIn()
    }

    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
    this.handleOnPublish = this._handleOnPublish.bind(this)
  }

  componentDidMount() {
    NewCommentsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    NewCommentsStore.removeChangeListener(this.onStoreChange)
  }

  renderButton() {
    const valid = NewCommentsStore.valid(this.props.storyId)
    return (
      <Button bg="navy" color={valid ? 'green' : 'grey'} disabled={!valid} onClick={this.handleOnPublish}>Post comment</Button>
    )
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
            <MarkdownArea ref="comment" placeholder="What do you think of this story?" onChange={this.handleOnChange} value={this.state.comment} />
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
      comment: NewCommentsStore.get(this.props.storyId)
    })
    // TODO: fix this! temporary fix because state change is not changing the value of textfield in MarkdownArea
    React.findDOMNode(this.refs.comment).value = this.state.comment || ''
  }
}
