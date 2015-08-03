import {connect} from 'redux/react'
import * as commentFormActions from 'actions/commentFormActions'
import Avatar from 'ui/Avatar.jsx'
import classnames from 'classnames'
import CommentForm from './CommentForm.jsx'
import * as discussionActions from 'actions/discussionActions'
import FlairClicker from 'components/FlairClicker.jsx'
import Heart from 'components/Heart.jsx'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import Markdown from 'ui/Markdown.jsx'
import moment from 'config/moment'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'

@connect((state, props) => ({
  changelog: state.currentChangelog.changelog,
  editing: props.comment.id === state.comments.editingCommentId,
}))
export default class Comment extends React.Component {
  constructor(props) {
    super(props)

    this.handleDelete = this._handleDelete.bind(this)
  }

  render() {
    const { comment } = this.props
    const user = comment.user

    const cs = classnames("flex-none mr2", {
      'muted': this.isDeleted(),
    })

    return (
      <div>
        {this.renderSelectedMarker()}
        <div className="flex visible-hover-wrapper">
          <div className={cs}>
            <Link to="profile" params={paramsFor.user(user)} title={`@${user.username}`}>
              <Avatar user={user} size={24} />
            </Link>
          </div>

          <div className="flex-auto h5" id={comment.id}>
            <div className="flex">
              <Link className="flex-auto bold black"
                to="profile"
                params={{userId: user.username}}>
                {user.username}
              </Link>
              <div className="flex-none flex gray mxn1 visible-hover">
                <div className="px1">
                  {moment(comment.created_at).fromNow()}
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
    if (this.isDeleted()) {
      return <div className="gray">Deleted</div>
    }

    const { comment } = this.props
    if (this.props.editing) {
      return (
        <CommentForm user={comment.user}
                     defaultValue={comment.body}
                     showAvatar={false}
                     onPublish={this.handleUpdateComment} />
      )
    }


    return (
      <div>
        <Markdown markdown={comment.parsed_body || comment.body || ''} />

        <div className="h5 silver flex mxn1 mt2">
          {this.renderHearts()}
          {this.renderFlair()}
          {this.renderTweet()}
        </div>
      </div>
    )
  }

  isDeleted() {
    return !!this.props.comment.deleted_at
  }

  renderHearts() {
    const { comment } = this.props
    return (
      <div className="p1">
        <Heart heartable={comment} />
      </div>
    )
  }

  renderFlair() {
    const { changelog, comment } = this.props

    if (!changelog.user_is_team_member && comment.flairs_count === 0) {
      return null
    }

    return (
      <div className="p1">
        <FlairClicker flairable={comment} changelog={changelog} />
      </div>
    )
  }

  renderTweet() {
    const { comment } = this.props
    return (
      <div className="p1">
        <a target="_blank"
          className="gray gray-hover"
          href={`/deeplinks/twitter?text=${encodeURIComponent(comment.body)}%20-%20${window.location}%23${comment.id}%20via%20%40asm`}>
          <Icon icon="twitter" />
        </a>
      </div>
    )
  }

  renderDeleteButton() {
    if (!this.props.comment.id || this.props.comment.deleted_at) {
      return null
    }

    if (!(SessionStore.user &&
        (SessionStore.user.id === this.props.comment.user.id || SessionStore.user.staff_at !== null) )) {
      return null
    }

    return (
      <div className="px1 pointer gray-hover" onClick={this.handleDelete.bind(this)}>
        <Icon icon="trash" />
      </div>
    )
  }

  renderEditButton() {
    if (!this.props.comment.id || this.props.comment.deleted_at) {
      return null
    }

    if (!(SessionStore.user &&
        SessionStore.user.id === this.props.comment.user.id)) {
      return null
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
      return null
    }

    return (
      <div className="border border-orange mb2" style={{marginTop: '-1rem'}}></div>
    )
  }

  toggleEditing() {
    this.props.dispatch(discussionActions.toggleEditComment(this.props.comment))
  }

  _handleDelete() {
    const { changelogId, storyId } = RouterContainer.get().getCurrentParams()
    const { comment } = this.props
    if (window.confirm('Are you sure you want to delete this comment?')) {
      this.props.dispatch(discussionActions.deleteComment(changelogId, storyId, comment.id))
    }
  }

  handleUpdateComment = (text) => {
    const { changelogId, storyId } = RouterContainer.get().getCurrentParams()
    this.props.dispatch(commentFormActions.update(
      changelogId,
      storyId,
      this.props.comment.id,
      text,
    ))
  }
}

Comment.propTypes = {
  comment: React.PropTypes.shape({
    user: React.PropTypes.object.isRequired,
    id: React.PropTypes.string,
    deleted_at: React.PropTypes.string,
  }).isRequired,
}
