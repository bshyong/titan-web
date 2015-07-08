import React from 'react'
import {connect} from 'redux/react'

@connect(state => ({
  isStaff: (state.currentUser && state.currentUser.staff_at),
}))
export default class StaffOnly extends React.Component {
  render() {
    if (!this.props.isStaff) {
      return <div />
    }
    return this.props.children
  }
}
