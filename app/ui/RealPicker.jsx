import React from 'react'
import Button from './Button.jsx'

export default class Picker extends React.Component {
  render() {
    const { children, onCancel, onOk, value } = this.props
    return (
      <div>
        <div className="bg-blue lighten-4 h2 p2">
          {value}
        </div>
        {children}
        <div className="p2 right-align">
          <Button style="transparent" color="blue" action={onCancel}>
            Cancel
          </Button>
          <Button style="transparent" color="blue" action={onOk}>
            Ok
          </Button>
        </div>
      </div>
    )
  }
}

Picker.propTypes = {
  children: React.PropTypes.node.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onOk: React.PropTypes.func.isRequired,
  value: React.PropTypes.node.isRequired,
}
