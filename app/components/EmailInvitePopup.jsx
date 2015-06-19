import Avatar from '../ui/Avatar.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import { List } from 'immutable'
import Picker from '../ui/Picker.jsx'
import React from 'react'
import Table from '../ui/Table.jsx'
import TypeaheadUsersStore from '../stores/typeahead_users_store'
import UserPickerActions from '../actions/user_picker_actions'

// @connectToStores(TypeaheadUsersStore)
export default class UserPicker extends React.Component {
  render() {
    return (
      <Picker position={this.props.position} maxHeight={73}>
        <div className={style.outer}>
          Invite {this.props.email} as a contributor
        </div>
      </Picker>
    )
  }
}

const style = {
  outer: classnames('px2 py2 gray')
}
