require('basscss/css/basscss.css')
import {Link} from 'react-router'
import Avatar from 'components/avatar.js.jsx'
import Markdown from 'components/ui/markdown.js.jsx'
import React from 'react'

const Story = React.createClass({

  propTypes: {
    story: React.PropTypes.shape({
      body: React.PropTypes.string.isRequired
    }).isRequired
  },

  getInitialState() {
    return {
      open: false
    }
  },

  render() {
    const {story: {user, body}} = this.props
    const [title] = body.split("\n\n")
    let b = (
      <div>{title}<a className="silver" href="#" onClick={this.handleOpen}> <span className="fa fa-plus-circle"></span></a></div>
    )

    if (this.state.open) {
      b = <Markdown text={body} />
    }

    return <div className="relative">
      <div className="clearfix px2" onClick={this.handleOpen}>

        <div className="left mxn2">
          <Avatar user={user} size="2rem" />
        </div>
        <div className="right ">
          <div className="bg-teal circle ml1 mr1" style={{width: '1rem', height: '1rem'}} />
        </div>
        <div className="overflow-hidden px3">
          {b}
        </div>
      </div>
    </div>
  },

  handleOpen(e) {
    e.preventDefault()
    this.setState({
      open: true
    })
  }
})

export default Story
