import {Link} from 'react-router'
import {List} from 'immutable'
import Avatar from 'components/ui/avatar.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Label from 'components/ui/label.jsx'
import React from 'react'
import Stack from 'components/ui/stack.jsx'
import classnames from 'classnames'
import moment from 'moment'
import Markdown from 'components/ui/markdown.jsx'
import LoadingBar from 'components/ui/loading_bar.jsx'
import Discussion from 'components/discussion.jsx'

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
      story: {id: storyId, user, title, body},
    } = this.props

    return (
      <div className="sm-flex">
        {this.labels()}
        <div className="flex-auto flex">
          <a className="flex-auto black" href="#" onClick={this.handleToggle}>
            {title}
          </a>
          <div className="flex-none ml2">
            <Stack items={this.contributors().map(user => <Avatar user={user} size={24} />)} />
          </div>
        </div>
      </div>
    )
  }

  contributors() {
    if (this.props.story.contributors && this.props.story.contributors.length > 0) {
      return this.props.story.contributors
    }
    return [this.props.story.user]
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
        <div className="mb2 pointer" onClick={this.handleToggle}>
          <div className="mb1">
            {this.labels()}
          </div>

          <div className="flex">
            <div className="flex-auto">
              <h1 className="mt0 mb0">{story.title}</h1>
            </div>
            <div className="flex-none ml3">
              <Stack items={[<Avatar user={story.user} size={40} />]} />
            </div>
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

        <Discussion comments={[{author: story.user, body: 'This is a comment!'}]} storyId={story.id} />

        <LoadingBar loading={false} />
      </div>
    )
  }

  labels() {
    let {story: {labels}} = this.props

    return List(labels).map(label => {
      return <div className="flex-none mr2 mb1 sm-mb0" key={label}>
        <Label name={label} />
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
