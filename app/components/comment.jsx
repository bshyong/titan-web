import React from 'react'
import Avatar from 'components/ui/avatar.jsx'
import Markdown from 'components/ui/markdown.jsx'
import moment from 'config/moment'

export default class Comment extends React.Component {
  render() {
    const {
      comment: {user, body, created_at}
    } = this.props

    return (
      <div className="flex-auto h5">
        <div className="flex">
          <div className="flex-auto bold">{user.username}</div>
          <div className="flex-none gray">
            {moment(created_at).fromNow(true)}
          </div>
        </div>
        <Markdown markdown={body} />
      </div>
    )
  }
}
