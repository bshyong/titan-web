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
    const [title, content] = body.split("\n", 2)
    const author = {
      username: username
    }

    return <div className="relative">
      <div className="relative clearfix py2" onClick={this.handleOpen}>
        <div className="left mr2">
          <Avatar user={author} size={42} />
        </div>
        <div className="overflow-hidden">
          <Markdown text={title} />
          <div className="h6 mid-gray">
            {username} posted {moment(created_at).fromNow()}
          </div>
        </div>
      </div>
    </div>
  }
})

export default Post
