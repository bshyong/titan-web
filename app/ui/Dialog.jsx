import React from 'react'

const zIndex = 100

export default class Dialog extends React.Component {
  render() {
    return (
      <div className="fixed top-0 left-0 full-width bg-darken-4 flex flex-center" style={{zIndex, minHeight: '100vh'}}>
        <div className="relative shadow rounded overflow-hidden bg-white m2 full-width sm-mx-auto sm-col-8 md-col-6 lg-col-4">
          {this.props.children}
        </div>
      </div>
    )
  }
}
