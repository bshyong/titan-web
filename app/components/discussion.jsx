import Avatar from 'components/ui/avatar.jsx'
import Comment from 'components/comment.jsx'
import CommentForm from 'components/comment_form.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import pluralize from 'lib/pluralize'
import React from 'react'
import DiscussionActions from 'actions/discussion_actions'
import CommentsStore from 'stores/comments_store'
import Table from 'components/ui/table.js.jsx'
import {List} from 'immutable'

export default class Discussion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: []
    }
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    CommentsStore.addChangeListener(this.onStoreChange)
    DiscussionActions.fetchAll(this.props.changelogId, this.props.storyId)
  }

  componentWillUnmount() {
    CommentsStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const comments = List(this.state.comments).sortBy(comment => comment.created_at)
    return (
      <div style={{marginBottom: '20rem'}}>
        <Table>
          <Table.Separator label={pluralize(comments.count(), 'Comment', 'Comments')} />
          {this.renderComments()}
        </Table>

        <div className="p2 md-px0">
          <CommentForm storyId={this.props.storyId} changelogId={this.props.changelogId}/>
        </div>
      </div>
    )
  }

  renderComments() {
    const comments = List(this.state.comments).sortBy(comment => comment.created_at)
    return (
      comments.map(
        comment => {
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
        }
      )
    )
  }

  _onStoreChange() {
    this.setState({
      comments: CommentsStore.all().sort(function(a,b){
        return a.created_at < b.created_at
      })
    })
  }

}

Discussion.propTypes = {
  storyId: React.PropTypes.string.isRequired,
  changelogId: React.PropTypes.string.isRequired,
}
