import React from 'react'
import classnames from 'classnames'

export default class Navbar extends React.Component {
  static propTypes = {
    bg: React.PropTypes.string,
    bgImgUrl: React.PropTypes.string,
    title: React.PropTypes.node,
    left: React.PropTypes.node,
    right: React.PropTypes.node,
    size: React.PropTypes.string,
  }

  render() {
    const {bg, bgImgUrl, title, children, left, right, size} = this.props
    const cn = classnames(
      'navbar',
      'flex flex-column full-width relative z1',
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

    const content = size === 'small' ? this.renderSmall() : this.renderDefault()

    return (
      <div className={cn} style={style}>
        {this.renderShade()}
        {content}
      </div>
    )
  }

  renderDefault() {
    const {title, children, left, right} = this.props
    return <div>
      <div className="flex flex-center full-width" style={{height: '4rem'}}>
        <div>{left}</div>
        <div className="flex-grow center bold">{title}</div>
        <div>{right}</div>
      </div>

      <div className="container full-width" style={{marginTop: '-4rem'}}>
        {children}
      </div>
    </div>
  }

  renderSmall() {
    const {title, children, left, right} = this.props
    return <div>
      <div className="flex flex-center full-width" style={{height: '4rem'}}>
        <div className="flex-none">{left}</div>
        <div className="container full-width">
          {children}
        </div>
        <div className="flex-none">{right}</div>
      </div>
    </div>
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
