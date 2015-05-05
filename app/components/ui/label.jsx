import React from 'react'

const Colors = [
  {text: 'green', bg: '#EBFAED'}
]

// {text: 'blue', bg: '#E5F1FC'},
// {text: 'red', bg: '#FFEAEB'},
// {text: 'yellow', bg: '#FFFCE5'},
// {text: 'purple', bg: '#F8E7FA'},
// {text: 'teal', bg: '#EBFAFA'},
// {text: 'aqua', bg: '#F2FCFF'}

export default class Label extends React.Component {
  render() {
    const {name} = this.props
    const color = Colors[Math.floor(Math.random() * Colors.length)]
    const style = {
      backgroundColor: color.bg
    }
    return <div className={`rounded px1 inline-block bold ${color.text}`} style={style}>
      {name}
    </div>
  }
}

Label.propTypes = {
  name: React.PropTypes.string.isRequired
}
