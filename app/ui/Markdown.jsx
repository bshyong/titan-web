import marked from 'marked'
import React from 'react'

export default class Markdown extends React.Component {
  render() {
    return <div className="markdown" 
        dangerouslySetInnerHTML={{__html: marked(this.props.markdown) }} />
  }
}

Markdown.propTypes = {
  markdown: React.PropTypes.string.isRequired
}
