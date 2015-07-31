import Comment from './comment.jsx'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import connectToStores from '../lib/connectToStores.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import pluralize from '../lib/pluralize'
import React from 'react'
import SubscribeStoryButton from './subscribe_story_button.jsx'
import {connect} from 'redux/react'

function getCommentsCount(grouped, slug) {
  const group = grouped.find(g => g.stories.get(slug))
  return group.stories.get(slug).live_comments_count
}

@connect((state, props) => ({
  commentsCount: getCommentsCount(state.groupedStories.grouped, props.story.slug),
}))
@connectToStores(CommentsStore)
export default class Discussion extends React.Component {
  static getPropsFromStores() {
    return {
      comments: CommentsStore.all(),
      loading: CommentsStore.loading,
    }
  }

  componentDidMount() {
    this.scrollToComment()
  }

  componentDidUpdate() {
    this.scrollToComment()
  }

  render() {
    const { loading, story } = this.props
    return (
      <div>
        <div className="flex py1 border-bottom gray h5 px2 sm-px0">
          <div className="flex-auto ref-comments-count">
            {pluralize(this.props.commentsCount, 'Comment', 'Comments')}
          </div>
          <div className="flex-none">
            <SubscribeStoryButton story={story} />
          </div>
        </div>

        <div className="px2 sm-px0">
          {this.renderComments()}
        </div>
        <LoadingBar loading={loading} />

        <div className="p2 md-px0">
          <CommentForm storyId={story.slug} changelogId={this.props.changelogId}/>
        </div>
      </div>
    )
  }

  renderComments() {
    return this.props.comments.map(comment =>
      <div className="py2" key={comment.id}>
        <Comment comment={comment}
                 storyId={this.props.story.slug}
                 changelogId={this.props.changelogId} />
      </div>
    )
  }

  scrollToComment() {
    const scrollId = window.location.hash.substr(1)
    if (this.scrollId !== scrollId) {
      this.scrollId = scrollId
      this.scrolled = false
    }

    if (this.scrolled) {
      return
    }

    const el = document.getElementById(this.scrollId)

    if (el) {
      this.scrolled = true
      el.scrollIntoView({behavior: "smooth"})
    }
  }
}

Discussion.propTypes = {
  story: React.PropTypes.object.isRequired,
  changelogId: React.PropTypes.string.isRequired,
}
