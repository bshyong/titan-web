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
      <div className="bg-smoke rounded flex flex-center" style={style}>
        <div className="black h1 mx-auto bold">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    )
  }
}

Logo.propTypes = {
  changelog: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    logo_url: React.PropTypes.string.isRequired
  }).isRequired,
  size: React.PropTypes.string.isRequired,
}
