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
  'improvement': '📈',
  'feature': '💯',
  'update': '🎉',
  'bugfix': '🐛',
  'doc': '📄',
  'default': '✅'
}

export default class Story extends React.Component {

  constructor(props) {
    super(props)
    this.handleToggle = this._handleToggle.bind(this)
    this.state = {
      open: false
    }

    this.contributors = this.contributors.bind(this)
  }

  render() {
    const {
      open
    } = this.state

    let cs = classnames('story', {
      'story--opened': open
    })

    let content
    if (open) {
      content = this.renderOpen()
    } else {
      content = this.renderClosed()
    }

    return (
      <div className={cs}>
        {content}
      </div>
    )
  }

  renderClosed() {
    const {
      changelogId,
      story: {id: storyId, user, body, title, labels, comments_count},
    } = this.props

    const label = labels[0] || 'default'
    const emojiChar = EmojiMappings[label.toLowerCase()]

    let comments

    if (comments_count > 0) {
      comments = comments = (
        <div className="flex-none gray" style={{minWidth: '4rem'}}>
          <span className="light-gray">
            <Icon icon="comment" fw={true} />
          </span>
          {' '}
          {comments_count}
        </div>
      )
    }

    return (
      <a className="p1 flex blue pointer" onClick={this.handleToggle}>
        <div className="flex-none mr1" key={label}>
          {this.emoji()}
        </div>
        <div className="flex-auto black">
          {title}
        </div>
        <div className="flex-none sm-show px1">
          <Stack items={this.contributors().map(user => <Avatar user={user} size={24} />)} />
        </div>
      </a>
    )
  }

  contributors() {
    const {story} = this.props
    if (story.contributors && story.contributors.length > 0) {
      return story.contributors
    }
    return [story.user]
  }

  renderOpen() {
    const {
      story,
    } = this.props

    let body

    if (story.body.length > 0) {
      body = <Markdown markdown={story.body} />
    }

    return (
      <div>
        <div className="flex mb2 pointer" onClick={this.handleToggle}>
          <div className="mr2">
            {this.emoji()}
          </div>

          <div className="flex-auto">
            <h1 className="mt0 mb0">{story.title}</h1>
          </div>
          <div className="flex-none ml3">
            <Stack items={[<Avatar user={story.user} size={40} />]} />
          </div>
        </div>

        <div className="flex h5 gray mxn3 px3 mb3">

          <div className="flex-none p1">
            <Avatar user={story.user} size={19} />
          </div>
          <div className="flex-auto p1">
            Written {moment(story.created_at).fromNow()}
          </div>

          <Link to="edit" params={{changelogId: this.props.changelogId, storyId: this.props.story.id}} className="flex-none p1 block gray">
            <Icon icon="pencil" />
          </Link>
        </div>

        {body}

        <hr />

        <Discussion comments={[{author: story.user, body: 'This is a comment!'}]} storyId={story.id} changelogId={this.props.changelogId} />

        <LoadingBar loading={false} />
      </div>
    )
  }

  emoji(story) {
    const {story: {labels}} = this.props
    const label = labels[0] || 'default'
    const emojiChar = EmojiMappings[label.toLowerCase()]
    return <Emoji char={emojiChar} />
  }

  labels() {
    let {story: {labels}} = this.props

    return List(labels).map(label => {
      const emoji = EmojiMappings[label.toLowerCase()] || '✅'
      return <div className="flex-none mr2 mb1 sm-mb0" key={label}>
        <Emoji char={emoji} />
      </div>
    }).toJS()
  }

  _handleToggle(e) {
    e.preventDefault()
    this.setState({open: !this.state.open})
  }
}

Story.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  story: React.PropTypes.shape({
    body: React.PropTypes.string.isRequired
  }).isRequired
}
