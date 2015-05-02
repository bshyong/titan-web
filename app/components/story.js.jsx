import {Link} from 'react-router'
import {List} from 'immutable'
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
        {this.labels()}
        <Link className="flex-auto px1 black" to="story" params={{storyId: storyId, changelogId}}>
          {title}
        </Link>
        <div className="flex-none px1">
          <Stack items={[<Avatar user={user} size={24} />]} />
        </div>
      </div>
    )
  }

  labels() {
    const {story: {labels}} = this.props
    return List(labels).map(label => {
      return <div className="flex-none px1" key={label}>
        <Label name={label} />
      </div>
    }).toJS()
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
