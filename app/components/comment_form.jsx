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
    this.state = this.getStateFromStores()

    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
  }

  componentDidMount() {
    NewCommentsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    NewCommentsStore.removeChangeListener(this.onStoreChange)
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
          <Button bg="navy" color="white">Post comment</Button>
        </div>
      </div>
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
  }

  getStateFromStores() {
    return {
      comment: NewCommentsStore.get(this.props.storyId),
      user: SessionStore.user,
      isSignedIn: SessionStore.isSignedIn()
    }
  }
}
