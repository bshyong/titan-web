import Button from './ui/button.js.jsx'
import GifActions from '../actions/gif_actions'
import GifStore from '../stores/gif_store'
import Icon from './ui/icon.js.jsx'
import LoadingBar from './ui/loading_bar.jsx'
import Picker from './ui/picker.jsx'
import React from 'react'
import { reactionStrings } from '../config/gifpicker'

let giphyAttribution = ''
if (typeof __TEST__ === 'undefined') {
  giphyAttribution = require('../images/giphy.png')
}

export default class GifPicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchTerm: GifStore.currentSearchTerm(),
      reactionImages: GifStore.reactionImages,
      currentGifIndex: 0,
      fetching: GifStore.fetching,
      gifs: []
    }

    this.timeout = null
    this.reactionStrings = this.randomReactionStrings()
    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnChange = this._handleOnChange.bind(this)
  }

  randomReactionStrings() {
    return Object.keys(reactionStrings).reduce((memo, curr) => {
      const stringsForReaction = reactionStrings[curr]
      return memo.concat(
        stringsForReaction[Math.floor(Math.random() * stringsForReaction.length)]
      )
    }, [])
  }

  componentDidMount() {
    GifStore.addChangeListener(this.onStoreChange)
    this.gifResults = React.findDOMNode(this.refs.gifResults)
    GifActions.fetchImagesForReactions(this.reactionStrings)
  }

  componentWillUnmount() {
    GifStore.removeChangeListener(this.onStoreChange)
    const string = React.findDOMNode(this.refs.gifSearch).value = null
    GifActions.changeSearchTerm(string)
    GifStore.clearStore()
  }

  render() {
    const { fetching, searchTerm } = this.state

    return (
      <Picker position="top" maxHeight={400}>
        <div className="center" ref="gifResults" style={{maxHeight: 350, overflowY: 'scroll'}}>
          {this.renderPicker()}
          <LoadingBar loading={fetching && searchTerm !== null} />
        </div>
        <form className="flex">
          <input type="text"
            className="field-light flex-grow"
            placeholder="gif search"
            value={searchTerm}
            onChange={this.handleOnChange}
            ref="gifSearch" />
            <div className="flex-none m0 flex flex-center" style={{maxHeight: 36}}>
              <div style={{height: 30}}>
                <img src={giphyAttribution} style={{height: '100%'}} />
              </div>
            </div>
        </form>
      </Picker>
    )
  }

  renderPicker() {
    if (this.state.searchTerm) {
      return this.renderGifs()
    } else {
      return this.renderReactionPicker()
    }
  }

  renderReactionPicker() {
    const reactions = this.reactionStrings.reduce((memo, curr) => {
      const imageUrl = this.state.reactionImages.get(curr)
      const styles = {
        backgroundImage: `url(${imageUrl})`,
        minHeight: 120,
      }
      return memo.concat(
        <div className="col col-3 bg-cover bg-center relative pointer border border-white"
             key={curr}
             style={styles}
             onClick={this._handleOnReactionClick.bind(this, curr)}>
          <div className="flex flex-center center" style={{minHeight: 120}}>
            <div className="z1 bg-black muted" style={{position: 'absolute', width: '100%', height: '100%'}} />
            <div className="z3 mx-auto px2 bg-black bold white">
              {curr}
            </div>
          </div>
        </div>
      )
    }, [])

    return (
      <div className="clearfix m0 p0">
        {reactions}
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

    if (this.state.fetching) {
      return (
        <div className="flex flex-center h5 gray p2 center" style={{maxHeight: 50}}>
          <div className="mx-auto">
            Loading...
          </div>
        </div>
      )
    }

    if (gifRows.length > 0) {
      return (
        <div>
          {gifRows}
        </div>
      )
    } else {
      return (
        <div className="flex flex-center h5 gray p2 center" style={{maxHeight: 50}}>
          <div className="mx-auto">
            No gifs found; try another search term?
          </div>
        </div>
      )
    }
  }

  handleGifSelect(gif) {
    React.findDOMNode(this.refs.gifSearch).value = ''
    this.handleOnChange()
    this.props.onGifSelect(gif)
  }

  handleOnMouseEnter(gif) {
    React.findDOMNode(this.refs[gif.id]).play()
  }

  handleOnMouseLeave(gif) {
    React.findDOMNode(this.refs[gif.id]).pause()
  }

  // should be a row of gifs
  renderGif(gif) {
    const maxHeight = 200
    const halfContainerWidth = this.gifResults.offsetWidth / 2
    const gifWidth = parseInt(gif.width)
    const smallGif = gifWidth <= halfContainerWidth
    const xTranslation = smallGif ? 0 : Math.abs((gifWidth - halfContainerWidth) / gifWidth / 2 * 100)
    const gifStyle = {
      transform: `translate(-${xTranslation}%, 0)`,
      width: smallGif ? '100%' : 'auto',
      height: smallGif ? 'auto' : '100%',
    }

    if (gif) {
      return (
        <div className="col col-6 center m0 p0 border border-white pointer"
             style={{overflow: 'hidden'}}
             key={gif.id}
             onMouseEnter={this.handleOnMouseEnter.bind(this, gif)}
             onMouseLeave={this.handleOnMouseLeave.bind(this, gif)}
             onClick={this.handleGifSelect.bind(this, gif)}>
          <div style={{overflow: 'hidden', maxHeight: maxHeight}}>
            <video  loop style={gifStyle} ref={gif.id}>
              <source src={gif.mp4} type="video/mp4" />
              <source src={gif.webp} type="image/webp" />
              <img src={gif.still_url} />
            </video>
          </div>
        </div>
      )
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

  _handleOnReactionClick(reaction) {
    React.findDOMNode(this.refs.gifSearch).value = reaction
    this._handleOnChange()
  }

  _handleOnChange() {
    const string = React.findDOMNode(this.refs.gifSearch).value
    GifActions.changeSearchTerm(string)
    if (string && (string.length > 0)) {
      this.debounce(
        GifActions.fetchGifs, GifActions, [string]
      )()
    }
  }

  _onStoreChange() {
    this.setState({
      fetching: GifStore.fetching,
      gifs: GifStore.getAll(),
      reactionImages: GifStore.reactionImages,
      searchTerm: GifStore.currentSearchTerm(),
    })
  }
}

GifPicker.propTypes = {
  onGifSelect: React.PropTypes.func.isRequired,
}
