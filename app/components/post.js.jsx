import moment from 'moment'

import React from 'react'
import Avatar from './avatar.js.jsx'
import Markdown from './ui/markdown.js.jsx'

const Post = React.createClass({

  propTypes: {
    post: React.PropTypes.shape({
      body: React.PropTypes.string.isRequired
    }).isRequired
  },

  render() {
    const {post: {username, body, created_at}} = this.props
    const [title, ...contentParts] = body.split("\n\n")
    const content = contentParts.join("\n\n")
    const author = {
      username: username
    }

    return <div className="relative">
      <div className="relative clearfix py2" onClick={this.handleOpen}>
        <div className="left mr2">
          <Avatar user={author} size={24} />
        </div>
        <div className="overflow-hidden">
          <h3 className="mt0 mb2">{title}</h3>
          <Markdown text={content} />
          <div className="h6 mid-gray">
            {username} posted {moment(created_at).fromNow()}
          </div>
        </div>
      </div>
    </div>
  }
})

export default Post
