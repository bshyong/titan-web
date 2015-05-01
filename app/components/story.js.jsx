import {Link} from 'react-router'
import Avatar from 'components/ui/avatar.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Label from 'components/ui/label.jsx'
import React from 'react'
import Stack from 'components/ui/stack.jsx'

export default class Story extends React.Component {

  constructor(props) {
    super(props)
    this.handleOpen = this._handleOpen.bind(this)
    this.state = {
      open: false
    }
  }

  render() {
    const {
      changelogId,
      story: {id: storyId, user, title, body},
    } = this.props

    return (
      <div className="flex mxn1">
        {this.label()}
        <Link className="flex-auto px1 black" to="story" params={{storyId: storyId, changelogId}}>
          {this.title()}
        </Link>
        <div className="flex-none px1">
          <Stack items={[<Avatar user={user} size={24} />]} />
        </div>
      </div>
    )
  }

  title() {
    const {story: {title}} = this.props
    const match = title.match(/^(\[([\w]+)\]\s)(.+)/)
    if (match) {
      return match[3]
    } else {
      return title
    }
  }

  label() {
    const {story: {title}} = this.props
    const match = title.match(/^(\[([\w]+)\]\s)(.+)/)
    if (match) {
      const labelName = match[2]
      return <div className="flex-none px1">
        <Label name={labelName} color="#2ECC40" bg="#EBFAED" />
      </div>
    }
  }

  _handleOpen(e) {
    e.preventDefault()
    this.setState({open: true})
  }
}

Story.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  story: React.PropTypes.shape({
    body: React.PropTypes.string.isRequired
  }).isRequired
}
