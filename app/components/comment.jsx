import Avatar from '../ui/Avatar.jsx'
import classnames from 'classnames'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import connectToStores from '../lib/connectToStores.jsx'
import DiscussionActions from '../actions/discussion_actions'
import Flair from 'components/Flair.jsx'
import Icon from '../ui/Icon.jsx'
import Link from '../components/Link.jsx'
import Markdown from '../ui/Markdown.jsx'
import moment from '../config/moment'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import ChangelogStore from 'stores/changelog_store'
import TallyCounter from 'ui/TallyCounter.jsx'
import Heart from 'components/Heart.jsx'
import FlairClicker from 'components/FlairClicker.jsx'

@connectToStores(CommentsStore)
export default class Comment extends React.Component {
  static getPropsFromStores(props) {
    return {
      changelog: ChangelogStore.changelog,
      editing: CommentsStore.editingCommentId === props.comment.id,
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

          <div className="flex-auto h5" id={id}>
            <div className="flex">
              <Link className="flex-auto bold black"
                to="profile"
                params={{userId: user.username}}>
                {user.username}
              </Link>
              <div className="flex-none flex gray mxn1 visible-hover">
                <div className="px1">
                  {moment(created_at).fromNow()}
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

    if (this.props.editing) {
      return (
        <CommentForm {...this.props.comment}
            storyId={this.props.storyId}
            changelogId={this.props.changelogId} />
      )
    }

    const {
      changelog,
      comment: { body, parsed_body, created_at, hearts_count }
    } = this.props

    return (
      <div>
        <Markdown markdown={parsed_body || body || ''} />

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
      return
    }

    return (
      <div className="p1">
        <FlairClicker flairable={comment} changelog={changelog} />
      </div>
    )
  }

  renderTweet() {
    const { comment: { body, id } } = this.props
    return (
      <div className="p1">
        <a target="_blank"
          className="gray gray-hover"
          href={`/deeplinks/twitter?text=${encodeURIComponent(body)}%20-%20${window.location}%23${id}%20via%20%40asm`}>
          <Icon icon="twitter" />
        </a>
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
