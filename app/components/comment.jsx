import React from 'react'
import Avatar from 'components/ui/avatar.jsx'
import Markdown from 'components/ui/markdown.jsx'
import Icon from 'components/ui/icon.js.jsx'
import moment from 'config/moment'
import DiscussionActions from 'actions/discussion_actions'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'

export default class Comment extends React.Component {

  constructor(props) {
    super(props)

    this.handleDelete = this._handleDelete.bind(this)
  }

  render() {
    const {
      comment: {id, user, body, created_at, deleted_at}
    } = this.props

    if (deleted_at) {
      return this.renderDeletedComment()
    } else {
      return (
        <div className="flex-auto h5">
          <div className="flex">
            <div className="flex-auto bold">{user.username}</div>
            <div className="flex-none gray">
              {moment(created_at).fromNow(true)}
            </div>
            {this.renderDeleteButton()}
          </div>
          <Markdown markdown={body || ''} />
        </div>
      )
    }
  }

  renderDeletedComment() {
    const { comment: { created_at } } = this.props

    return (
      <div className="flex-auto h5">
        <div className="flex">
          <div className="silver flex-auto">Deleted</div>
          <div className="flex-none silver">
            {moment(created_at).fromNow(true)}
          </div>
        </div>
      </div>
    )
  }

  renderDeleteButton() {
    if (SessionStore.user && SessionStore.user.id === this.props.comment.user.id)
    return (
      <div className="flex-none gray ml1">
        <span onClick={this.handleDelete}>
          <Icon icon='trash' />
        </span>
      </div>
    )
  }

  _handleDelete() {
    const { changelogId, storyId } = RouterContainer.get().getCurrentParams()
    if (window.confirm('Are you sure you want to delete this comment?')) {
      DiscussionActions.deleteComment(changelogId, storyId, this.props.comment.id)
    }
  }
}
