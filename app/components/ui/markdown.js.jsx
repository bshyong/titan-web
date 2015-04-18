require('./markdown.css')
import marked from 'marked'
import React from 'react'

const Markdown = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  render() {
    const markdown = marked(this.props.text)
    return <div className="markdown" dangerouslySetInnerHTML={{__html: markdown}} />
  }
})

export default Markdown
