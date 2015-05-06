import React from 'react'
import Avatar from 'components/ui/avatar.jsx'
import Markdown from 'components/ui/markdown.jsx'

export default class Comment extends React.Component {
  render() {
    const {
      comment: {author, body}
    } = this.props

    return (
      <div className="flex">
        <div className="flex-none mr2">
          <Avatar user={author} size={24} />
        </div>
        <div className="flex-auto">
          <Markdown markdown={body} />
        </div>
      </div>
    )
  }
}
