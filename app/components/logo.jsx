import React from 'react'

export default class Logo extends React.Component {
  render() {
    const { size } = this.props
    const src = "https://pbs.twimg.com/profile_images/459865462927413248/luicO7zK_400x400.png"
    const style = {
      width: size,
      height: size
    }
    return (
      <img className="block bg-white rounded shadow" src={src} style={style} />
    )
  }
}
