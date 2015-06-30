import Avatar from '../ui/Avatar.jsx'
import Comment from './comment.jsx'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import connectToStores from '../lib/connectToStores.jsx'
import GifPicker from './gif_picker.jsx'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import LoadingBar from '../ui/LoadingBar.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import pluralize from '../lib/pluralize'
import React from 'react'
import SubscribeStoryButton from './subscribe_story_button.jsx'
import Table from '../ui/Table.jsx'
import {List} from 'immutable'

@connectToStores(CommentsStore, GroupedStoriesStore)
export class Discussion extends React.Component {
  static getPropsFromStores(props) {
    return {
      comments: CommentsStore.all(),
      commentsCount: GroupedStoriesStore.getCommentsCount(props.story.slug),
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
    let scrollId = window.location.hash.substr(1)
    if (this.scrollId !== scrollId) {
      this.scrollId = scrollId
      this.scrolled = false
    }

    if (this.scrolled) {
      return
    }

    let el = document.getElementById(this.scrollId)

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
