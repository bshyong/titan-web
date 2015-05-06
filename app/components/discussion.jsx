import Avatar from 'components/ui/avatar.jsx'
import Comment from 'components/comment.jsx'
import CommentForm from 'components/comment_form.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import pluralize from 'lib/pluralize'
import React from 'react'

export default class Discussion extends React.Component {

  render() {
    const { comments } = this.props
    return (
      <div>
        <div className="flex mb2">
          <div className="half-width">
            {pluralize(comments.length, 'comment', 'comments')}
          </div>
        </div>

        {comments.map(comment =>
          <div className="mb2" key={comment.id}>
            <Comment comment={comment} />
          </div>
        )}

        <CommentForm />
      </div>
    )
  }

}
