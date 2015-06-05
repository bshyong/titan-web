import React from 'react'

export default class ErrorPage extends React.Component {
  render() {
    return (
      <div className="flex flex-justify">
        <div className="col-1"></div>
        <div className="col col-10">
          <h1>{this.props.error.message}</h1>
          <pre>
            <code>{this.props.error.backtrace.join('\n')}</code>
          </pre>
        </div>
        <div className="col-1"></div>
      </div>
    )
  }
}
