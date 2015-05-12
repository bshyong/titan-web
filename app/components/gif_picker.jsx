import React from 'react'
import GifActions from 'actions/gif_actions'
import GifStore from 'stores/gif_store'
import Button from 'components/ui/button.js.jsx'
import Icon from 'components/ui/icon.js.jsx'

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
        <form className="mb2 flex">
          <input type="text"
            className="field-light flex-grow"
            placeholder="gif search"
            value={this.state.searchTerm}
            onChange={this.handleOnChange}
            ref="gifSearch" />
          <Button className="flex-shrink">Search</Button>
        </form>
        {this.renderButtons()}
        <div className="center">
          {this.renderGif()}
        </div>
      </div>
    )
  }

  renderGif() {
    const gif = this.state.gifs[this.state.currentGifIndex]
    if (gif) {
      return (
        <iframe
          src={`${gif.embed_url}?html5=true`}
          height={`${gif.height}px`}
          frameBorder="0"
          webkitAllowFullScreen
          mozallowfullscreen
          allowFullScreen />
      )
    } else {
      return
    }
  }

  renderButtons() {
    if (this.state.gifs && this.state.gifs.length > 0) {
      return (
        <div className="center flex">
          <div className="flex-grow" />
          <ul className="list-reset mb0 mxn1 h5 flex">
            <li className="px1 blue" onClick={this.clickPrev}>
              <Icon icon="chevron-left" /> Prev
            </li>
            <li className="px1 blue" onClick={this.clickNext}>
              <Icon icon="chevron-right" /> Next
            </li>
          </ul>
          <div className="flex-grow" />
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
    })
  }

}
