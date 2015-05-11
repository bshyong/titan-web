import React from 'react'
import GifActions from 'actions/gif_actions'
import GifStore from 'stores/gif_store'

export default class GifPicker extends React.Component {
  constructor(props) {
    super(props)
    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
  }

  componentDidMount() {
    GifStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    GifStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    return (
      <input type="text"
        className="field-light full-width block mb0"
        placeholder="What changed?"
        value={title}
        onChange={this.handleChanged}
        ref="title" />
    )
  }

  _handleOnChange() {

  }

  _debounce(fn, delay) {
    let timer = null
    return () => {
      let context = this
      let args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }

  _onStoreChange() {
    return
  }

}
