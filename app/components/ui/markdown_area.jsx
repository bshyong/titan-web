import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {List} from 'immutable'

export default class MarkdownArea extends React.Component {
  render() {
    const style = {
      ...this.props.style,
      resize: 'none'
    }

    return <TextareaAutosize
              {...this.props}
              className="field-light border-silver mb0 block full-width"
              style={style} />
  }
}

MarkdownArea.propTypes = {
  style: React.PropTypes.object
}
