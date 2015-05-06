import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export default class MarkdownArea extends React.Component {
  render() {
    const style = {
      resize: 'none'
    }
    return <TextareaAutosize {...this.props} className="field-light mb0 block full-width" style={style} />
  }
}
