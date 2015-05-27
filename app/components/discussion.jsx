import Avatar from '../ui/Avatar.jsx'
import Comment from './comment.jsx'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import LoadingBar from '../ui/LoadingBar.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import StoryStore from '../stores/story_store'
import Table from '../ui/Table.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import pluralize from '../lib/pluralize'
import {List} from 'immutable'

@connectToStores(CommentsStore, StoryStore)
export default class Discussion extends React.Component {
  static getPropsFromStores(props) {
    return {
      comments: CommentsStore.all(),
      commentsCount: StoryStore.getCommentsCount(props.storyId),
      loading: CommentsStore.loading,
    }
  }

  render() {
    return (
      <div style={{marginBottom: '20rem'}}>
        <Table>
          <Table.Separator label={pluralize(this.props.commentsCount, 'Comment', 'Comments')} />
          <LoadingBar loading={this.props.loading} />
          {this.renderComments()}
        </Table>

        <div className="p2 md-px0">
          <CommentForm storyId={this.props.storyId} changelogId={this.props.changelogId}/>
        </div>
      </div>
    )
  }

  renderComments() {
    return this.props.comments.map(comment => {
      const renderedComment = <Comment comment={comment}
          storyId={this.props.storyId}
          changelogId={this.props.changelogId} />

      if (comment.deleted_at) {
        return (
          <Table.DisabledCell key={comment.id} image={<Avatar user={comment.user} size={24} />}>
            {renderedComment}
          </Table.DisabledCell>
        )
      } else {
        return (
          <Table.Cell key={comment.id} image={<Avatar user={comment.user} size={24} />}>
            {renderedComment}
          </Table.Cell>
        )
      }
    })
  }
}

Discussion.propTypes = {
  storyId: React.PropTypes.string.isRequired,
  changelogId: React.PropTypes.string.isRequired,
}
