import {Link} from 'react-router'
import Avatar from 'components/avatar.js.jsx'
import Markdown from 'components/ui/markdown.js.jsx'
import React from 'react'
import Icon from 'components/ui/icon.js.jsx'

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

    let foo;

    if (body.length > 1) {
      foo = <div className="inline-block bg-light-gray gray">
        <Icon icon="ellipsis" />
      </div>
    }

    return (
      <div className="flex mxn1">
        

        <div className="flex-auto px1">
          {title}
          {foo}
        </div>

        <div className="flex-none px1">
          <Avatar user={user} size={24} />
        </div>

      </div>
    )
  }

  label() {
    const l = Labels[Math.floor(Math.random() * Labels.length)]
    return (
      <div className="rounded px1 inline-block h5 bold" style={{color: l.color, backgroundColor: l.bg, lineHeight: '24px'}}>
        {l.name}
      </div>
    )
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
