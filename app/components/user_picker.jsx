import Avatar from '../ui/Avatar.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import { List } from 'immutable'
import Picker from '../ui/Picker.jsx'
import React from 'react'
import Table from '../ui/Table.jsx'
import TypeaheadUsersStore from '../stores/typeahead_users_store'
import UserPickerActions from '../actions/user_picker_actions'

const DOWN_KEY = 40
const ENTER_KEY = 13
const ESC_KEY = 27
const TAB_KEY = 9
const UP_KEY = 38

const KEYS = [
  DOWN_KEY,
  ENTER_KEY,
  ESC_KEY,
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
    this.handleUserSelected = this._handleUserSelected.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    UserPickerActions.fetchUsers(this.props.query)
  }

  componentDidUpdate() {
    const { highlightIndex, maxHeight, users } = this.props
    const picker = React.findDOMNode(this.refs.picker)
    const scrollHeight = picker.scrollHeight
    const currentTop = picker.scrollTop
    const currentBottom = currentTop + maxHeight
    const cellHeight = scrollHeight / users.count()
    const currentLocation = cellHeight * highlightIndex

    this.cellHeight = cellHeight

    if (currentLocation >= currentBottom - cellHeight) {
      picker.scrollTop = currentLocation + cellHeight - maxHeight
    } else if (currentLocation < currentTop) {
      picker.scrollTop = currentLocation
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    const { maxHeight, users } = this.props
    const userCount = users.count()
    const userHeight = this.cellHeight ? userCount * this.cellHeight : maxHeight
    const height = Math.min(maxHeight, userHeight)

    return (
      <Picker {...this.props}
        maxHeight={height}
        shown={userCount > 0}
        ref="picker">
        <Table>
          {this.renderUsers()}
        </Table>
      </Picker>
    )
  }

  renderUsers() {
    const { highlightIndex } = this.props
    return this.props.users.map((u, i) => {
      const classes = classnames('pointer', 'px2', {
        'bg-blue': i === highlightIndex
      })

      return (
        <div className={classes}
            key={`${u.id}-${i}`}
            onClick={this.handleUserSelected.bind(this, u)}>
          <Table.Cell image={<Avatar user={u} size={24} />} active={i === highlightIndex}>
            <span className={i === highlightIndex ? 'white' : ''}>
              {u.username}
            </span>
          </Table.Cell>
        </div>
      )
    })
  }

  shouldComponentUpdate(nextProps) {
    const { highlightIndex, query, users } = this.props

    if (nextProps.query !== query) {
      UserPickerActions.fetchUsers(nextProps.query)
      return true
    }

    if (nextProps.users.size !== users.size || nextProps.highlightIndex !== highlightIndex) {
      return true
    }

    return false
  }

  _handleKeyDown(e) {
    const { keyCode } = e

    if (KEYS.indexOf(keyCode) > -1) {
      e.preventDefault()
      e.stopPropagation()

      const {
        highlightIndex,
        onUserSelected,
        users
      } = this.props
      const { picker } = this.refs

      switch (keyCode) {
        case DOWN_KEY:
          UserPickerActions.setHighlightIndex(highlightIndex + 1)
          break;
        case UP_KEY:
          UserPickerActions.setHighlightIndex(highlightIndex - 1)
          break;
        case ENTER_KEY:
        case TAB_KEY:
          this.handleUserSelected.bind(this)(users.get(highlightIndex), e)
          UserPickerActions.clearUsers()
          break
        case ESC_KEY:
          UserPickerActions.clearUsers()
          break
      }
    }
  }

  _handleUserSelected(u, e) {
    e.preventDefault()

    if (u) {
      this.props.onUserSelected(u)
    }

    UserPickerActions.clearUsers()
  }
}

UserPicker.defaultProps = {
  highlightIndex: 0,
  maxHeight: 300,
  position: "top",
  query: '',
  users: List()
}

UserPicker.propTypes = {
  highlightIndex: React.PropTypes.number,
  maxHeight: React.PropTypes.number,
  onUserSelected: React.PropTypes.func.isRequired,
  position: React.PropTypes.oneOf(['top', 'bottom']),
  query: React.PropTypes.string,
  users: React.PropTypes.instanceOf(List)
}
