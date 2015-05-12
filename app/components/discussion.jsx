import Avatar from '../ui/Avatar.jsx'
import Comment from './comment.jsx'
import CommentForm from './comment_form.jsx'
import CommentsStore from '../stores/comments_store'
import GifPicker from '../components/gif_picker.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import StoryStore from '../stores/story_store'
import SubscribeStoryButton from '../components/subscribe_story_button.jsx'
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
      story: StoryStore.get(props.storyId)
    }
  }

  componentDidMount() {
    this.scrollToComment()
  }

  componentDidUpdate() {
    this.scrollToComment()
  }

  render() {
    return (
      <div style={{marginBottom: '20rem'}}>
        <Table>
          <div className="flex">
            <div className="flex-auto">
              <Table.Separator label={pluralize(this.props.commentsCount, 'Comment', 'Comments')} />
            </div>
            <div className="flex-none">
              {this.props.story ? this.renderSubscribeLink() : null}
            </div>
          </div>
          <LoadingBar loading={this.props.loading} />
          {this.renderComments()}
        </Table>

        <div className="p2 md-px0">
          <CommentForm storyId={this.props.storyId} changelogId={this.props.changelogId}/>
        </div>
        <GifPicker />
      </div>
    )
  }

  renderSubscribeLink() {
    return (
      <div className="h5 p2 md-px0 mt2 mb0 gray border-bottom">
        <SubscribeStoryButton story={this.props.story} />
      </div>
    )
  }

  renderComments() {
    let selected = window.location.hash.substr(1)
    return this.props.comments.map(comment => {
      const renderedComment = <Comment comment={comment}
          storyId={this.props.storyId}
          changelogId={this.props.changelogId} />

      if (comment.deleted_at) {
        return (
          <Table.DisabledCell id={comment.id} key={comment.id} selected={comment.id === selected}
              image={<Avatar user={comment.user} size={24} />}>
            {renderedComment}
          </Table.DisabledCell>
        )
      } else {
        return (
          <Table.Cell id={comment.id} key={comment.id} selected={comment.id === selected}
              image={<Avatar user={comment.user} size={24} />}>
            {renderedComment}
          </Table.Cell>
        )
      }
    })
  }

  scrollToComment() {
    let el = document.getElementById(window.location.hash.substr(1))

    if (el) {
      el.scrollIntoView({behavior: "smooth"})
    }
  }
}

Discussion.propTypes = {
  storyId: React.PropTypes.string.isRequired,
  changelogId: React.PropTypes.string.isRequired,
}
