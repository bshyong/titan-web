import React from 'react'
import Avatar from 'components/ui/avatar.jsx'
import Markdown from 'components/ui/markdown.jsx'
import moment from 'moment'

export default class Comment extends React.Component {
  render() {
    const {
      comment: {user, body, created_at}
    } = this.props

    return (
      <div className="flex">
        <div className="flex-none mr2">
          <Avatar user={user} size={24} />
        </div>
        <div className="flex-auto">
          <div>
            <span className="bold">{user.username}</span>
            {' '}
            <span className="gray regular">{moment(created_at).fromNow(true)}</span>
          </div>
          <Markdown markdown={body} />
        </div>
      </div>
    )
  }
}
