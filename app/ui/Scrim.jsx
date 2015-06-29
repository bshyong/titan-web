import React from 'react'

export default class Scrim extends React.Component {
  render() {
    if (!this.props.shown) {
      return null
    }

    const style = {
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.97)'
    }

    return (
      <div className="fixed top-0 right-0 left-0 z4 center overflow-auto"
        style={style}
        {...this.props}>
        {this.props.children}
      </div>
    )
  }
}

Scrim.propTypes = {
  shown: React.PropTypes.bool
}
