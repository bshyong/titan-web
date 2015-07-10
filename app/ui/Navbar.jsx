import React from 'react'
import classnames from 'classnames'

export default class Navbar extends React.Component {
  static propTypes = {
    bg: React.PropTypes.string,
    bgImgUrl: React.PropTypes.string,
    title: React.PropTypes.node,
    left: React.PropTypes.node,
    right: React.PropTypes.node,
  }

  render() {
    const {bg, bgImgUrl, title, children, left, right} = this.props
    const cn = classnames(
      'navbar',
      'sm-flex flex-column full-width relative z1',
      `bg-${bg}`,
    )
    const style = {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '4rem',
    }

    if (bgImgUrl) {
      style.backgroundImage = `url(${bgImgUrl})`
    }

    return (
      <div className={cn} style={style}>
        {this.renderShade()}
        <div className="flex flex-center full-width" style={{height: '4rem'}}>
          <div>{left}</div>
          <div className="flex-grow center bold">{title}</div>
          <div>{right}</div>
        </div>

        <div className="container full-width" style={{marginTop: '-4rem'}}>
          {children}
        </div>
      </div>
    )
  }

  renderShade() {
    if(!this.props.bgImgUrl) {
      return
    }
    return (
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-darken-4" style={{zIndex: -1}} />
    )
  }
}
