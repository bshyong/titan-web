import {Link} from 'react-router'
import {List} from 'immutable'
import Avatar from 'components/ui/avatar.jsx'
import classnames from 'classnames'
import Discussion from 'components/discussion.jsx'
import Emoji from 'components/ui/emoji.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Label from 'components/ui/label.jsx'
import LoadingBar from 'components/ui/loading_bar.jsx'
import Markdown from 'components/ui/markdown.jsx'
import moment from 'moment'
import React from 'react'
import Stack from 'components/ui/stack.jsx'

export default class Story extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }

    this.contributors = this.contributors.bind(this)
  }

  render() {
    const {
      changelogId,
      story: {id: storyId, user, title, comments_count, hearts_count},
    } = this.props

    return (
      <Link className="flex black gray-visited pointer mxn1 p2 md-px0" to="story" params={{changelogId, storyId}}>
        {this.emoji()}
        <div className="flex-auto px1">
          <div>{title}</div>
        </div>
        <div className="flex-none sm-show px1">
          <Stack items={this.contributors().map(user => <Avatar user={user} size={24} />)} />
        </div>

        <div className="flex-none px1">
          <div className="h5 gray mxn1 flex">
            <div className="px1">
              <span className="silver"><Icon icon="heart" /></span>
              {' '}
              {hearts_count}
            </div>
            <div className="px1">
              <span className=" silver"><Icon icon="comment" /></span>
              {' '}
              {comments_count}
            </div>
          </div>
        </div>

      </Link>
    )
  }

  contributors() {
    const {story} = this.props
    if (story.contributors && story.contributors.length > 0) {
      return story.contributors
    }
    return [story.user]
  }
}

Story.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  story: React.PropTypes.shape({
    body: React.PropTypes.string.isRequired
  }).isRequired
}
