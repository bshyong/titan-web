import React from 'react'

export default class Gif extends React.Component {
  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        {this.props.video ? this.renderVideo() : this.renderGif()}
      </div>
    )
  }

  renderVideo() {
    const {
      gif,
      autoPlay,
    } = this.props

    return (
      <video
        loop
        autoPlay={autoPlay}
        ref='gif'
        style={{minWidth: '100%', minHeight: '100%'}}
        onMouseEnter={this.handleOnMouseEnter.bind(this)}
        onMouseLeave={this.handleOnMouseLeave.bind(this)}
        poster={gif.poster_url}>
        {this.renderSource(gif.video_urls.mp4)}
        {this.renderSource(gif.video_urls.webp)}
        {this.renderGif()}
      </video>
    )
  }

  renderSource(url) {
    const match = url.match(/\.\w{3,4}/gi)
    if (!match) { return }

    let type
    switch (match.pop()) {
      case ".mp4":
        type = "video/mp4"
        break;
      case ".webp":
        type = "image/webp"
        break;
      default:
        break;
    }
    return type ? <source src={url} type={type} /> : null
  }

  renderGif() {
    const {
      gif,
    } = this.props
    return <img src={gif.poster_url} style={{minWidth: '100%', minHeight: '100%'}} />
  }

  handleOnMouseEnter() {
    React.findDOMNode(this.refs.gif).play()
  }

  handleOnMouseLeave() {
    React.findDOMNode(this.refs.gif).pause()
  }
}

Gif.propTypes = {
  autoPlay: React.PropTypes.bool,
  gif: React.PropTypes.shape({
      poster_url: React.PropTypes.string,
      video_urls: React.PropTypes.shape({
        mp4: React.PropTypes.string,
        webp: React.PropTypes.string,
      }),
      url: React.PropTypes.string.isRequired
    }).isRequired,
  video: React.PropTypes.bool,
}

Gif.defaultProps = {
  video: false,
  autoPlay: false,
}
