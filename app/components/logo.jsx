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
    return (
      <div className="bg-silver rounded" style={style}>
        <img className="block rounded" src={src} style={style} alt={name} />
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
