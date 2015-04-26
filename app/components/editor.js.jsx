import React from 'react'
import EditorStore from 'stores/editor_store'
import EditorActionCreator from 'actions/editor_action_creator'

export default class Editor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: EditorStore.text
    }
    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleTextChange = this._handleTextChange.bind(this)
  }

  componentDidMount() {
    EditorStore.addChangeListener(this.onStoreChange)
    this.refs.textarea.getDOMNode().focus()
  }

  componentWillUnmount() {
    EditorStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const style = {
      border: 'none',
      resize: 'none'
    }

    return <textarea
      className="flex-auto field-light mb0 block full-width"
      style={style}
      placeholder="What did you do?"
      ref="textarea"
      value={this.state.text}
      onChange={this.handleTextChange} />
  }

  _handleTextChange(e) {
    const text = this.refs.textarea.getDOMNode().value
    EditorActionCreator.typed(text)
  }

  _onStoreChange() {
    this.setState({
      text: EditorStore.text
    })
  }
}
