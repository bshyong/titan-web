import Avatar from '../ui/Avatar.jsx'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import DiscussionActions from '../actions/discussion_actions'
import Icon from '../ui/Icon.jsx'
import Markdown from '../ui/Markdown.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import classnames from 'classnames'
import moment from '../config/moment'
import onMobile from '../lib/on_mobile'

export default class Comment extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }

    this.handleCommentsChanged = this._handleCommentsChanged.bind(this)
    this.handleDelete = this._handleDelete.bind(this)
    this.toggleEditing = this._toggleEditing.bind(this)
  }

  componentDidMount() {
    CommentsStore.addChangeListener(this.handleCommentsChanged)
  }

  componentWillUnmount() {
    CommentsStore.removeChangeListener(this.handleCommentsChanged)
    // prevent calls to setState while component is unmounting
    this.unmounting = true
  }

  render() {
    const {
      comment: {id, user, body, parsed_body, created_at, deleted_at}
    } = this.props

    const classes = {
      container: classnames('flex-auto h5', {
        'visible-hover-wrapper': !onMobile()
      }),
      element: classnames('flex-none gray', {
        'visible-hover': !onMobile()
      })
    }

    if (deleted_at) {
      return this.renderDeletedComment()
    } else {
      return (
        <div className={classes.container}>
          <div className="flex">
            <div className="flex-auto bold">{user.username}</div>
            <div className={classes.element}>
              {moment(created_at).fromNow(true)} ago
            </div>
            {this.renderEditButton()}
            {this.renderDeleteButton()}
          </div>
          {this.renderBody()}
        </div>
      )
    }
  }

  renderBody() {
    if (this.state.editing) {
      return (
        <div className="mt1">
          <CommentForm {...this.props.comment}
              storyId={this.props.storyId}
              changelogId={this.props.changelogId} />
        </div>
      )
    }

    const {
      comment: { body, parsed_body }
    } = this.props

    return <Markdown markdown={parsed_body || body || ''} />
  }

  renderDeletedComment() {
    const { comment: { created_at } } = this.props

    return (
      <div className="flex-auto h5">
        <div className="flex">
          <div className="flex-auto gray">Deleted</div>
          <div className="flex-none gray">
            {moment(created_at).fromNow()}
          </div>
        </div>
      </div>
    )
  }

  renderDeleteButton() {
    if (SessionStore.user &&
        SessionStore.user.id === this.props.comment.user.id) {
      return (
        <div className="flex-none gray ml1 pointer">
          <span onClick={this.handleDelete}>
            <Icon icon='trash' />
          </span>
        </div>
      )
    }
  }

  renderEditButton() {
    if (SessionStore.user &&
        SessionStore.user.id === this.props.comment.user.id) {
      return (
        <div className="flex-none gray ml1 mr1 pointer">
          <span onClick={this.toggleEditing}>
            <Icon icon="pencil" />
          </span>
        </div>
      )
    }
  }

  _handleCommentsChanged() {
    if (!this.unmounting) {
      this.setState({
        editing: false
      })
    }
  }

  _handleDelete() {
    const { changelogId, storyId } = RouterContainer.get().getCurrentParams()
    if (window.confirm('Are you sure you want to delete this comment?')) {
      DiscussionActions.deleteComment(changelogId, storyId, this.props.comment.id)
    }
  }

  _toggleEditing(e) {
    this.setState({
      editing: !this.state.editing
    })
  }
}
