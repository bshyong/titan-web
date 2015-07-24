import React from 'react'

export default class Scrim extends React.Component {
  render() {
    const style = {
      backgroundColor: 'rgba(255, 255, 255, 0.97)',
      height: '100%',
    }

    return (
      <div className="fixed top-0 right-0 left-0 z4 center overflow-auto"
        style={style}
        {...this.props} />
    )
  }
}
