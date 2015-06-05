import React from 'react'
import MetaLogoSrc from '../images/meta-logo.svg'

export default class Logo extends React.Component {
  render() {
    const { size, src } = this.props
    const style = {
      width: size,
      height: size
    }
    return (
      <img className="block bg-white rounded" src={src} style={style} />
    )
  }
}

Logo.propTypes = {
  src: React.PropTypes.string.isRequired
}
