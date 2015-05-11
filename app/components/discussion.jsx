import Avatar from 'components/ui/avatar.jsx'
import Comment from 'components/comment.jsx'
import CommentForm from 'components/comment_form.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import pluralize from 'lib/pluralize'
import React from 'react'
import DiscussionActions from 'actions/discussion_actions'
import CommentsStore from 'stores/comments_store'

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
    const { comments } = this.state
    return (
      <div>
        <div className="mb3">
          {comments.map(comment =>
            <div className="mb2" key={comment.id}>
              <Comment comment={comment}/>
            </div>
          )}
        </div>

        <CommentForm storyId={this.props.storyId} changelogId={this.props.changelogId}/>
      </div>
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
