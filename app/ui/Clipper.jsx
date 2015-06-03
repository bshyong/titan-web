import React from 'react'

export default class Clipper extends React.Component {

  render() {
    const boundWidth = this.props.bounds.width
    const boundHeight = this.props.bounds.height

    const widthRatio = boundWidth * 1.0 / this.props.image.width
    const heightRatio = boundHeight * 1.0 / this.props.image.height
    const ratio = widthRatio > heightRatio ? widthRatio : heightRatio

    const minWidth = this.props.image.width * ratio
    const minHeight = this.props.image.height * ratio
    const xTranslation = minWidth > boundWidth ? (minWidth - boundWidth) * 50.0 / minWidth : 0
    const yTranslation = minHeight > boundHeight ? (minHeight - boundHeight) * 50.0 / minHeight : 0

    const contentStyle = {
      transform: `translate(-${xTranslation}%, -${yTranslation}%)`,
      minWidth: minWidth,
      minHeight: minHeight,
    }

    return (
      <div className="overflow-hidden" style={{maxHeight: boundHeight}}>
        <div style={contentStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

Clipper.propTypes = {
  bounds: React.PropTypes.shape({
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  }).isRequired,
  image: React.PropTypes.shape({
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  }).isRequired,
}
