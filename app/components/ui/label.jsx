import React from 'react'

export default class Label extends React.Component {
  render() {
    const {name} = this.props
    const style = {
      backgroundColor: "#EBFAED"
    }
    return <div className="rounded px1 inline-block bold green" style={style}>
      {name}
    </div>
  }
}

Label.propTypes = {
  name: React.PropTypes.string.isRequired
}
