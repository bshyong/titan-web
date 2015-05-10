import React from 'react'
import classnames from 'classnames'

export default class Jumbotron extends React.Component {
  render() {
    const { bgColor, children, bgImageUrl } = this.props
    const cn = classnames(
      "bg-cover bg-no-repeat bg-center py3 sm-py4 relative",
      `bg-${bgColor}`
    )
    const style = {
      backgroundImage: `url(${bgImageUrl})`
    }
    return (
      <div className={cn} style={style}>
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-darken-3" />
        <div className="container px2 md-px0 relative">
          {children}
        </div>
      </div>
    )
  }
}

Jumbotron.propTypes = {
  bgColor: React.PropTypes.string.isRequired,
  bgImageUrl: React.PropTypes.string,
}

Jumbotron.defaultProps = {
  bgColor: 'gray'
}
