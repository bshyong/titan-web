import {Link} from 'react-router'
import Avatar from 'components/ui/avatar.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Label from 'components/ui/label.jsx'
import Markdown from 'components/ui/markdown.js.jsx'
import React from 'react'
import Stack from 'components/ui/stack.jsx'

const Labels = [
  {name: 'Feature', color: '#0074D9', bg: '#E5F1FB'},
  {name: 'Fix', color: '#2ECC40', bg: '#EBFAED'},
  {name: 'Annoucement', color: '#FFDC00', bg: '#FFFDEA'}
]

export default class Story extends React.Component {

  constructor(props) {
    super(props)
    this.handleOpen = this._handleOpen.bind(this)
    this.state = {
      open: false
    }
  }

  render() {
    const {story: {user, title, body}} = this.props

    return (
      <div className="flex mxn1">
        <a className="flex-auto px1">
          {title}
        </a>
        <div className="flex-none px1">
          <Stack items={[<Avatar user={user} size={24} />]} />
        </div>
      </div>
    )
  }

  label() {
    const l = Labels[Math.floor(Math.random() * Labels.length)]
    return <Label {...l} />
  }

  _handleOpen(e) {
    e.preventDefault()
    this.setState({open: true})
  }
}

Story.Labels = Labels

Story.propTypes = {
  story: React.PropTypes.shape({
    body: React.PropTypes.string.isRequired
  }).isRequired
}
