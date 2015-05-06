import React from 'react'

const Colors = {
  'discussion': 'yellow',
  'update': 'red',
  'improvement': 'green',
  'feature': 'blue'
}

export default class Label extends React.Component {
  render() {
    const {name} = this.props
    const color = Colors[name.toLowerCase()] || 'gray'
    const style = {
      textTransform: 'uppercase',
      letterSpacing: 1,
      lineHeight: '1.5rem',
      fontSize: 10
    }
    return <div className="" style={{width: '8rem'}}>
      <div className={`inline-block px2 pill bold white center bg-${color} h6`} style={style}>
        {name}
      </div>
    </div>
  }
}

Label.propTypes = {
  name: React.PropTypes.string.isRequired
}
