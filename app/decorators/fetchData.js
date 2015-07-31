import React from 'react'

export default function fetchData(callback) {
  return Component => class FetchDataDecorator extends React.Component {
    static displayName = `FetchData(${Component.displayName || Component.name || 'Component'})`
    static Component = Component
    static fetchData = callback
    static willTransitionTo = Component.willTransitionTo

    render() {
      return <Component {...this.props} />
    }
  }
}
