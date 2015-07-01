import React from 'react'

export default class Field extends React.Component {
  get value() {
    return this.refs.field.value
  }

  render() {
    return <input {...this.props} className="field-light block full-width" ref="field" />
  }
}
