import Avatar from './avatar.jsx'
import classnames from 'classnames'
import connectToStores from '../../lib/connectToStores.jsx'
import { List } from 'immutable'
import PickerContainer from './picker_container.jsx'
import React from 'react'
import Table from './table.jsx'
import TypeaheadUsersStore from '../../stores/typeahead_users_store'
import UserPickerActions from '../../actions/user_picker_actions'

const DOWN_KEY = 40
const ENTER_KEY = 13
const TAB_KEY = 9
const UP_KEY = 38

const KEYS = [
  DOWN_KEY,
  ENTER_KEY,
  TAB_KEY,
  UP_KEY
]

@connectToStores(TypeaheadUsersStore)
export default class UserPicker extends React.Component {
  static getPropsFromStores(props) {
    return {
      highlightIndex: TypeaheadUsersStore.highlightIndex,
      users: TypeaheadUsersStore.users
    }
  }

  constructor(props) {
    super(props)

    this.handleKeyDown = this._handleKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    return (
      <PickerContainer {...this.props} shown={this.props.users.count > 0}>
        <Table>
          {this.renderUsers()}
        </Table>
      </PickerContainer>
    )
  }

  renderUsers() {
    return this.props.users.map((u, i) => {
      const classes = classnames('px2', {
        'bg-silver': i === this.props.highlightIndex
      })

      return (
        <div className={classes} key={`${u.id}-${i}`}>
          <Table.Cell image={<Avatar user={u} size={24} />}>
            {u.username}
          </Table.Cell>
        </div>
      )
    })
  }

  _handleKeyDown(e) {
    const { keyCode } = e

    if (KEYS.indexOf(keyCode) > -1) {
      e.preventDefault()
      e.stopPropagation()

      switch (keyCode) {
        case DOWN_KEY:
          UserPickerActions.setHighlightIndex(this.props.highlightIndex + 1)
          break;
        case UP_KEY:
          UserPickerActions.setHighlightIndex(this.props.highlightIndex - 1)
          break;
        case ENTER_KEY:
        case TAB_KEY:
          this.props.onUserSelected(this.props.users.get(this.props.highlightIndex))
          break
      }
    }
  }
}

UserPicker.defaultProps = {
  highlightIndex: 0,
  maxHeight: 300,
  position: "top",
  users: List()
}

UserPicker.propTypes = {
  highlightIndex: React.PropTypes.number,
  maxHeight: React.PropTypes.number,
  onUserSelected: React.PropTypes.func.isRequired,
  position: React.PropTypes.oneOf(['top', 'bottom']),
  users: React.PropTypes.instanceOf(List)
}
