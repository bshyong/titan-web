import React from 'react'
import classnames from 'classnames'

export default class Jumbotron extends React.Component {
  render() {
    const { bgColor, bgImageUrl, color, children } = this.props
    const cn = classnames(
      "bg-cover bg-no-repeat bg-center py3 sm-py4 relative",
      `bg-${bgColor}`,
      color
    )
    const style = {
      backgroundImage: `url(${encodeURI(bgImageUrl)})`
    }
    return (
      <div className={cn} style={style}>
        {this.renderOverlay()}
        <div className="container px2 md-px0 relative">
          {children}
        </div>
      </div>
    )
  }

  renderOverlay() {
    if (!this.props.bgImageUrl) {
      return
    }

    return (
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-darken-4" />
    )
  }
}

Jumbotron.propTypes = {
  bgColor: React.PropTypes.string.isRequired,
  bgImageUrl: React.PropTypes.string,
  color: React.PropTypes.string.isRequired,
}

Jumbotron.defaultProps = {
  bgColor: 'gray',
  color: 'white',
}
