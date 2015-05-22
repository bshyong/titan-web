import Button from './ui/button.js.jsx'
import GifActions from '../actions/gif_actions'
import GifStore from '../stores/gif_store'
import Icon from './ui/icon.js.jsx'
import LoadingBar from './ui/loading_bar.jsx'
import React from 'react'
import { reactionStrings } from '../config/gifpicker'

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
  }

  render() {
    const { fetching, searchTerm } = this.state

    return (
      <div>
        <div className="center" ref="gifResults" style={{maxHeight: 400, overflowY: 'scroll'}}>
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
          <Button className="flex-shrink">
            <Icon icon="search" />
          </Button>
        </form>
      </div>
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
      const imageUrl = this.state.reactionImages[curr]
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
            <div className="z3 mx-auto bold white">
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
    const smallGif = gifWidth <= halfContainerWidth
    const xTranslation = smallGif ? 0 : Math.abs((gifWidth - halfContainerWidth) / gifWidth / 2 * 100)
    const gifStyle = {
      transform: `translate(-${xTranslation}%, 0)`,
      width: smallGif ? '100%' : 'auto',
      height: smallGif ? 'auto' : '100%',
    }

    if (gif) {
      return (
        <div className="col col-6 center m0 p0 border border-white" style={{overflow: 'hidden'}} key={gif.id}>
          <div style={{overflow: 'hidden', maxHeight: maxHeight}}>
            <video autoPlay loop style={gifStyle}>
              <source src={gif.mp4} type="video/mp4" />
              <source src={gif.webp} type="image/webp" />
              <img src={gif.url} />
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

    this.debounce(
      GifActions.fetchGifs, GifActions, [string]
    )()
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
