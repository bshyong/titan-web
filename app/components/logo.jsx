import React from 'react'
import MetaLogoSrc from '../images/meta-logo.svg'

export default class Logo extends React.Component {
  render() {
    const { changelog: { logo_url: src, name }, size } = this.props
    const style = {
      width: size,
      height: size,
      outline: 'none'
    }
    if (src) {
      return (
        <div className="bg-silver rounded" style={style}>
          <img className="block rounded" src={src} style={style} alt={name} />
        </div>
      )
    }
    return (
      <div className="bg-smoke rounded center" style={style}>
        <svg className="block" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" viewBox="0 0 20 20">
          <text textAnchor="middle" x="10" y="16" style={{fontWeight: 400}}>{name.charAt(0).toUpperCase()}</text>
        </svg>
      </div>
    )
  }
}

Logo.propTypes = {
  changelog: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    logo_url: React.PropTypes.string
  }).isRequired,
  size: React.PropTypes.string.isRequired,
}
