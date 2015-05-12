import React from 'react'
import GifActions from 'actions/gif_actions'
import GifStore from 'stores/gif_store'
import Button from 'components/ui/button.js.jsx'

export default class GifPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: GifStore.currentSearchTerm(),
      currentGifIndex: 0,
      gifs: []
    }

    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
    this.clickPrev = this._clickPrev.bind(this)
    this.clickNext = this._clickNext.bind(this)
  }

  componentDidMount() {
    GifStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    GifStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    return (
      <div>
        {this.renderButtons()}
        <input type="text"
          className="field-light full-width block mb2"
          placeholder="gif search"
          value={this.state.searchTerm}
          onChange={this.handleOnChange}
          ref="gifSearch" />
        <img src={this.state.gifs[this.state.currentGifIndex]} />
      </div>
    )
  }

  renderButtons() {
    if (this.state.gifs && this.state.gifs.length > 0) {
      return (
        <div>
          <Button
            bg="navy"
            text="white"
            action={this.clickPrev}>
              Prev
          </Button>
          <Button
            bg="navy"
            text="white"
            action={this.clickNext}>
              Next
          </Button>
        </div>
      )
    } else {
      return
    }
  }

  _clickPrev() {
    const totalLength = this.state.gifs.length
    const nextIndex = (this.state.currentGifIndex == 0 ? totalLength : this.state.currentGifIndex) - 1

    this.setState({
      currentGifIndex: nextIndex
    })
  }

  _clickNext() {
    const totalLength = this.state.gifs.length
    const nextIndex = (this.state.currentGifIndex == totalLength - 1 ? 0 : this.state.currentGifIndex + 1)

    this.setState({
      currentGifIndex: nextIndex
    })
  }

  _handleOnChange() {
    GifActions.changeSearchTerm(
      React.findDOMNode(this.refs.gifSearch).value
    )
    GifActions.fetchGifs(
      React.findDOMNode(this.refs.gifSearch).value
    )
  }

  _onStoreChange() {
    this.setState({
      gifs: GifStore.getAll(),
      searchTerm: GifStore.currentSearchTerm()
    }, console.log(this.state.gifs))
  }

}
