import React from 'react'
import Avatar from 'components/ui/avatar.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import Button from 'components/ui/button.js.jsx'

import SessionStore from 'stores/session_store'

export default class CommentForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.getStateFromStores()
  }

  render() {
    if (!this.state.isSignedIn) {
      return <div />
    }

    const { user } = this.state

    return (
      <div className="flex">
        <div className="flex-none mr2">
          <Avatar user={user} size={24} />
        </div>
        <div className="flex-auto">
          <div className="mb2">
            <MarkdownArea placeholder="What do you think of this story?" />
          </div>
          <Button bg="navy" color="white">Post comment</Button>
        </div>
      </div>
    )
  }

  getStateFromStores() {
    return {
      user: SessionStore.user,
      isSignedIn: SessionStore.isSignedIn()
    }
  }
}
