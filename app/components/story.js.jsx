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

const EmojiMappings = {
  'discussion': '💬',
  'improvement': '🔸',
  'feature': '🔸',
  'update': '🎉',
  'bugfix': '🐞',
  'doc': '📄',
  'default': '🔸'
}

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
      story: {id: storyId, user, body, title, labels, comments_count},
    } = this.props

    const label = labels[0] || 'default'
    const emojiChar = EmojiMappings[label.toLowerCase()]

    return (
      <Link className="flex black pointer mxn1 p2 md-px0" to="story" params={{changelogId, storyId}}>
        {this.emoji()}
        <div className="flex-auto px1">
          <div>{title}</div>

          <div className="h5 gray mxn1 flex">
            <div className="px1">
              <span className="silver"><Icon icon="heart" /></span>
              {' '}
              2
            </div>
            <div className="px1">
              <span className=" silver"><Icon icon="comment" /></span>
              {' '}
              {comments_count}
            </div>
          </div>
        </div>
        <div className="flex-none sm-show px1">
          <Stack items={this.contributors().map(user => <Avatar user={user} size={24} />)} />
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

  emoji(story) {
    const {story: {labels}} = this.props
    const label = labels[0] || 'default'
    const emojiChar = EmojiMappings[label.toLowerCase()] || '🔸'
    return (
      <div className="flex-none px1" key={label}>
        <Emoji char={emojiChar} size={36} />
      </div>
    )
  }
}

Story.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  story: React.PropTypes.shape({
    body: React.PropTypes.string.isRequired
  }).isRequired
}
