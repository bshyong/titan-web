import * as gifActions from 'actions/gifActions'
import Button from '../ui/Button.jsx'
import Clipper from '../ui/Clipper.jsx'
import Gif from '../ui/Gif.jsx'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import onMobile from '../lib/on_mobile'
import Picker from '../ui/Picker.jsx'
import React from 'react'
import ScrollEater from '../ui/ScrollEater.jsx'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import shouldPureComponentUpdate from 'react-pure-render/function';
import { reactionStrings } from '../config/gifpicker'
import {debounceFunc} from '../lib/debounce'

let giphyAttribution = require('../images/giphy.png')
let giphyAttributionHoriz = require('../images/giphy-h.png')

export class GifPicker extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  constructor(props) {
    super(props)
    this.state = {}
    this.onMobile = onMobile()
    this.timeout = null
    this.reactionStrings = this.randomReactionStrings()
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
    this.gifResults = React.findDOMNode(this.refs.gifResults)
    this.picker = React.findDOMNode(this.refs.picker)
    this.props.fetchImagesForReactions(this.reactionStrings)
    React.findDOMNode(this.refs.gifSearch).focus()
    this.setState({
      pickerHeight: this.picker.clientHeight
    })
  }

  componentWillUnmount() {
    const string = React.findDOMNode(this.refs.gifSearch).value = null
    this.props.changeSearchTerm(string)
    this.props.clearGifs()
  }

  componentDidUpdate() {
    const newHeight = this.picker.clientHeight

    if (this.state.pickerHeight != newHeight) {
      this.setState({
        pickerHeight: newHeight
      })
    }
  }

  render() {
    const { pickerHeight } = this.state
    return (
      <Picker position={this.props.position} maxHeight={Math.min(400, pickerHeight)} fullscreen={this.onMobile}>
        <div style={{height: '100%', overflow: 'hidden'}} ref="picker">
          {this.onMobile ? this.renderForMobile() : this.renderForDesktop()}
        </div>
      </Picker>
    )
  }

  renderForMobile() {
    const { searchTerm } = this.props
    return (
      <div>
        <div className="p1 right-align h5 bg-white orange flex" style={{height: 36, position: 'sticky', top: 0}}>
          <div className="flex-grow">
            <form style={{height: 36}}>
              <input type="text"
                className="field-light flex-grow"
                placeholder="gif search"
                value={searchTerm}
                style={{width: '100%'}}
                onChange={this.handleOnChange}
                ref="gifSearch" />
            </form>
          </div>
          <div className="flex-none pointer ml1 flex flex-center" onClick={this.props.onPickerCancel}>Cancel</div>
        </div>
        {this.renderContentContainer()}
        <div className="flex flex-center muted">
          <img className="mx-auto p1" src={giphyAttributionHoriz} style={{maxHeight: 24}} />
        </div>
      </div>
    )
  }

  renderForDesktop() {
    const { searchTerm } = this.props
    return (
      <div>
        <div className="p1 right-align h5 bg-white orange flex" style={{height: 24, position: 'sticky', top: 0}}>
          <div className="flex-grow" />
          <div className="flex-none pointer" onClick={this.props.onPickerCancel}>Cancel</div>
        </div>
        {this.renderContentContainer()}
        <form className="flex" style={{height: 36}}>
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
      </div>
    )
  }

  renderContentContainer() {
    const { fetching, searchTerm } = this.props
    const style = {
      overflowY: 'scroll',
      maxHeight: this.onMobile ? 'calc(97vh - 60px)' : 300
    }

    const paginator = <ScrollPaginator
                    element={this.gifResults}
                    container={this.picker}
                    page={this.props.page}
                    onScrollBottom={() => this.props.getFromStore(this.props.page + 1)} />

    return (
      <ScrollEater>
        <div className="center" ref="gifResults" style={style}>
          {this.props.moreAvailable ? paginator : null}
          {this.renderPicker()}
          <LoadingBar loading={fetching && searchTerm !== null} />
        </div>
      </ScrollEater>
    )
  }

  renderPicker() {
    if (this.props.searchTerm) {
      return this.renderGifs()
    } else {
      return this.renderReactionPicker()
    }
  }

  renderReactionPicker() {
    const reactions = this.reactionStrings.reduce((memo, curr) => {
      const imageUrl = this.props.reactionImages.get(curr)
      const styles = {
        backgroundImage: `url(${imageUrl})`,
        minHeight: 120,
        cursor: 'pointer'
      }
      return memo.concat(
        <div className="col col-3 bg-cover bg-center relative pointer border border-white"
             key={curr}
             style={styles}
             onClick={this._handleOnReactionClick.bind(this, curr)}>
          <div className="flex flex-center center" style={{minHeight: 120}}>
            <div className="z1 bg-black muted" style={{position: 'absolute', width: '100%', height: '100%'}} />
            <div className="z3 mx-auto px1 h5 bg-black bold white" style={{wordWrap: 'break-word'}}>
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

    if (this.props.fetching) {
      return (
        <div className="flex flex-center h5 gray p2 center" style={{maxHeight: 50}}>
          <div className="mx-auto">
            Loading...
          </div>
        </div>
      )
    }

    const gifs = this.props.gifs

    let gifRows = gifs.reduce((memo, curr, index, array) => {
      if (index % 2 == 0) {
        const gifRowItems = gifs.slice(index, index+2).map(g => this.renderGif(g))
        memo.push(
          <div className="clearfix m0 p0" key={`gifRow_${index}`}>
            {gifRowItems}
          </div>
        )
      }
      return memo
    }, [])

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
    this.props.onGifSelect(gif, this.props.searchTerm)
    React.findDOMNode(this.refs.gifSearch).value = ''
    this.handleOnChange()
  }

  renderGif(gif) {
    const maxHeight = 150
    const halfContainerWidth = this.gifResults.offsetWidth / 2

    const propsForGifComponent = {
      poster_url: gif.still_url,
      video_urls: {
        mp4: gif.mp4,
        webp: gif.webp,
      },
      url: gif.small_url
    }

    return (
      <div className="col col-6 center m0 p0 border border-white pointer overflow-hidden pointer"
           key={gif.id}
           onClick={this.handleGifSelect.bind(this, gif)}>
        <Clipper
          image={{width: parseFloat(gif.width), height: parseFloat(gif.height)}}
          bounds={{width: halfContainerWidth, height: maxHeight}} >
          <Gif gif={propsForGifComponent} video={!this.onMobile} />
        </Clipper>
      </div>
    )
  }

  _handleOnReactionClick(reaction) {
    React.findDOMNode(this.refs.gifSearch).value = reaction
    this._handleOnChange()
  }

  _handleOnChange(e) {
    const string = React.findDOMNode(this.refs.gifSearch).value
    this.props.changeSearchTerm(string)
    this.fetchGifs(string)
  }

  fetchGifs = debounceFunc(string => {
    this.props.fetchGifs(string)
  }, 300)
}

GifPicker.propTypes = {
  onGifSelect: React.PropTypes.func.isRequired,
  onPickerCancel: React.PropTypes.func.isRequired,
  position: React.PropTypes.oneOf(['top', 'bottom']),
}

GifPicker.defaultProps = {
  position: 'top'
}

import {connect} from 'redux/react'
import {bindActionCreators} from 'redux'

@connect(state => {
  return {
  fetching: state.gifs.fetching,
  gifs: state.gifs.gifs.slice(0,(20 * state.gifs.page)),
  moreAvailable: state.gifs.moreAvailable,
  page: state.gifs.page,
  reactionImages: state.gifs.reactionImages,
  searchTerm: state.gifs.searchTerm,}
})
export default class GifPickerWrapper extends React.Component {
  render() {
    return <GifPicker {...this.props}
                      {...bindActionCreators(gifActions, this.props.dispatch)} />
  }
}
