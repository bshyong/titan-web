import React from 'react'
import MetaLogoSrc from 'images/meta-logo.svg'

export default class Logo extends React.Component {
  render() {
    const { size } = this.props
    const src = MetaLogoSrc
    const style = {
      width: size,
      height: size
    }
    return (
      <img className="block bg-white rounded shadow" src={src} style={style} />
    )
  }
}
