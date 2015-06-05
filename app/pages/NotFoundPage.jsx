import React from 'react'

var style = {
  bg: {
    backgroundImage: 'url(https://treasure.assembly.com/assets/404/2-a723642252af97d623e7337fb750b347.jpg)',
    backgroundSize: 'cover',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    display: 'table',
    width: '100%',
    height: '100%',
    minHeight: '100%'
  },

  text: {
    color: '#666',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center'
  }
}

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <div style={style.bg}>
        <h1 style={style.text}>Nope. 404</h1>
      </div>
    )
  }
}
