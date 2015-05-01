import './markdown.css'
import marked from 'marked'
import React from 'react'

export default class Markdown extends React.Component {
  render() {
    const html = marked(this.props.markdown)
    return <div className="markdown" dangerouslySetInnerHTML={{__html: html}} />
  }
}

Markdown.propTypes = {
  markdown: React.PropTypes.string.isRequired
}
