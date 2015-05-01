import {Link} from 'react-router'
import Avatar from 'components/ui/avatar.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Label from 'components/ui/label.jsx'
import Markdown from 'components/ui/markdown.js.jsx'
import React from 'react'
import Stack from 'components/ui/stack.jsx'

const Labels = {
  'Feature': {name: 'Feature', color: '#2ECC40', bg: '#EBFAED'},
  'Improvement': {name: 'Improvement', color: '#2ECC40', bg: '#EBFAED'},
  'Annoucement': {name: 'Annoucement', color: '#FFDC00', bg: '#FFFDEA'}
}

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
        {this.label()}
        <a className="flex-auto px1 black" href="#">
          {this.title()}
        </a>
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
      const l = Labels[match[2]]
      return <div className="flex-none px1">
        <Label {...l} />
      </div>
    }
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
