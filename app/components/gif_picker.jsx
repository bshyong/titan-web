import Button from './ui/button.js.jsx'
import GifActions from '../actions/gif_actions'
import GifStore from '../stores/gif_store'
import Icon from './ui/icon.js.jsx'
import React from 'react'

export default class GifPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: GifStore.currentSearchTerm(),
      currentGifIndex: 0,
      gifs: []
    }

    this.timeout = null

    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
    this.clickPrev = this._clickPrev.bind(this)
    this.clickNext = this._clickNext.bind(this)
  }

  componentDidMount() {
    GifStore.addChangeListener(this.onStoreChange)
    this.gifResults = React.findDOMNode(this.refs.gifResults)
  }

  componentWillUnmount() {
    GifStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    return (
      <div className="border border-black">
        <div className="center" ref="gifResults" style={{maxHeight: 400, overflowY: 'scroll'}}>
          {this.renderGifs()}
        </div>
        <form className="flex">
          <input type="text"
            className="field-light flex-grow"
            placeholder="gif search"
            value={this.state.searchTerm}
            onChange={this.handleOnChange}
            ref="gifSearch" />
          <Button className="flex-shrink">
            <Icon icon="search" />
          </Button>
        </form>
      </div>
    )
  }

  renderGifs() {
    const gifs = this.state.gifs

    let gifRows = []

    for (let indexValue of gifs.entries()) {
      const index = indexValue[0]
      if (index % 2 == 0) {
        const gifRowItems = gifs.slice(index, index+2).map(g => this.renderGif(g))
        gifRows.push(
          <div className="clearfix m0 p0" key={`gifRow_${index}`}>
            {gifRowItems}
          </div>
        )
      }
    }

    return (
      <div>
        {gifRows}
      </div>
    )
  }

  // should be a row of gifs
  renderGif(gif) {
    const maxHeight = 200
    const halfContainerWidth = this.gifResults.offsetWidth / 2
    const gifWidth = parseInt(gif.width)
    const xTranslation = (gifWidth - (halfContainerWidth) / gifWidth / 2 * 100
    const gifStyle = {
      transform: `translate(-${xTranslation}%, 0)`,
      width: gifWidth <= (halfContainerWidth ? '100%' : 'auto',
      height: gifWidth <= (halfContainerWidth ? 'auto%' : '100%',
    }

    if (gif) {
      return (
        <div className="col col-6 center m0 p0" style={{overflow: 'hidden'}} key={gif.id}>
          <div style={{overflow: 'hidden', maxHeight: maxHeight}}>
            <video autoPlay loop style={gifStyle}>
              <source src={gif.mp4} type="video/mp4" />
              <source src={gif.webp} type="image/webp" />
              <img src={gif.url} />
            </video>
          </div>
        </div>
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

  debounce(func, context, args) {
    return () => {
      let later = () => {
        this.timeout = null
        func.apply(context, args)
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(later, 200)
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
    const string = React.findDOMNode(this.refs.gifSearch).value
    this.debounce(
      GifActions.fetchGifs, GifActions, [string]
    )()
  }

  _onStoreChange() {
    this.setState({
      gifs: GifStore.getAll(),
      searchTerm: GifStore.currentSearchTerm()
    })
  }

}
