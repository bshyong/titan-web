import React from 'react'

const Tile = React.createClass({
  render() {
    const {children} = this.props
    const style = {
      borderColor: '#ECEDEF',
      boxShadow: '0 0 .25rem 0 rgba(0, 0, 0, .05)'
    }
    return (
      <div className="bg-white border rounded" style={style}>
        {children}
      </div>
    )
  }
})

export default Tile
