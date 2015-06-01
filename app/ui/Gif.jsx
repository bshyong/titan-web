import React from 'react'

export default class Gif extends React.Component {
  render() {
    return this.props.video ? this.renderVideo() : this.renderGif()
  }

  renderVideo() {
    const {
      gif,
      style,
      autoPlay,
    } = this.props

    return (
      <video
        loop
        autoPlay={autoPlay}
        ref='gif'
        style={style}
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
    let type
    switch (url.match(/\.\w{3,4}/gi).pop()) {
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
      style,
    } = this.props
    return <img src={gif.url} style={style} />
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
  style: React.PropTypes.object,
  video: React.PropTypes.bool,
}

Gif.defaultProps = {
  video: false,
  autoPlay: false,
}
