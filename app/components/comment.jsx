import Avatar from '../ui/Avatar.jsx'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import connectToStores from '../lib/connectToStores.jsx'
import DiscussionActions from '../actions/discussion_actions'
import Icon from '../ui/Icon.jsx'
import Markdown from '../ui/Markdown.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import classnames from 'classnames'
import moment from '../config/moment'
import onMobile from '../lib/on_mobile'
import Link from '../components/Link.jsx'

@connectToStores(CommentsStore)
export default class Comment extends React.Component {
  static getPropsFromStores(props) {
    return {
      editing: CommentsStore.editingCommentId === props.comment.id
    }
  }

  constructor(props) {
    super(props)

    this.handleDelete = this._handleDelete.bind(this)
  }

  render() {
    const {
      comment: {id, user, body, parsed_body, created_at}
    } = this.props

    return (
      <div>
        {this.renderSelectedMarker()}
        <div className="flex visible-hover-wrapper">
          <div className="flex-none mr2">
            <Avatar user={user} size={24} />
          </div>

          <div className="flex-auto h5" id={id}>
            <div className="flex">
              <Link className="flex-auto bold black" to="profile" params={{userId: user.username}}>{user.username}</Link>
              <div className="flex-none flex gray mxn1 visible-hover">
                <div className="px1">
                  {moment(created_at).fromNow(true)}
                </div>
                {this.renderEditButton()}
                {this.renderDeleteButton()}
              </div>
            </div>
            {this.renderBody()}
          </div>
        </div>
      </div>
    )
  }

  renderBody() {
    if (this.props.comment.deleted_at) {
      return <div className="gray">Deleted</div>
    }

    if (this.props.editing) {
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
    if (!this.props.comment.id || this.props.comment.deleted_at) {
      return
    }

    if (!(SessionStore.user &&
        (SessionStore.user.id === this.props.comment.user.id || SessionStore.user.staff_at !==null) )) {
      return
    }

    return (
      <div className="px1 pointer gray-hover" onClick={this.handleDelete.bind(this)}>
        <Icon icon="trash" />
      </div>
    )
  }

  renderEditButton() {
    if (!this.props.comment.id || this.props.comment.deleted_at) {
      return
    }

    if (!(SessionStore.user &&
        SessionStore.user.id === this.props.comment.user.id)) {
      return
    }

    return (
      <div className="px1 pointer gray-hover" onClick={this.toggleEditing.bind(this)}>
        <Icon icon="pencil" />
      </div>
    )
  }

  // TODO (@chrislloyd): This needs to be in the discussion component where
  // instead of taking the anchorId from the hash, it takes it from the stories'
  // lastCommentReadAt id or timestamp. That data is pending. When that happens
  // the markup can be a little cleaner.
  renderSelectedMarker() {
    const anchorId = window.location.hash.substr(1)

    if (this.props.comment.id !== anchorId) {
      return
    }

    return (
      <div className="border border-orange mb2" style={{marginTop: '-1rem'}}></div>
    )
  }

  toggleEditing() {
    DiscussionActions.toggleEditComment(this.props.comment)
  }

  _handleDelete() {
    const { changelogId, storyId } = RouterContainer.get().getCurrentParams()
    const { comment } = this.props
    if (window.confirm('Are you sure you want to delete this comment?')) {
      DiscussionActions.deleteComment(changelogId, storyId, comment.id)
    }
  }
}

Comment.propTypes = {
  comment: React.PropTypes.shape({
    user: React.PropTypes.object.isRequired,
    id: React.PropTypes.string,
    deleted_at: React.PropTypes.string,
  }).isRequired
}
