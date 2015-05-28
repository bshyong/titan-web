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
        {gif.video_urls.mp4 ? <source src={gif.video_urls.mp4} type="video/mp4" /> : null}
        {gif.video_urls.webp ? <source src={gif.video_urls.webp} type="image/webp" /> : null}
        {this.renderGif()}
      </video>
    )
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
