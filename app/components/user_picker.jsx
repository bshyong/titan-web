import Avatar from './ui/avatar.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import { List } from 'immutable'
import Picker from './ui/picker.jsx'
import React from 'react'
import Table from './ui/table.jsx'
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
    this.scroll = this._scroll.bind(this)
    this.scrollDown = this._scrollDown.bind(this)
    this.scrollUp = this._scrollUp.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    return (
      <Picker {...this.props} shown={this.props.users.count > 0} ref="picker">
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

  _handleKeyDown(e) {
    const { keyCode } = e

    if (KEYS.indexOf(keyCode) > -1) {
      e.preventDefault()
      e.stopPropagation()

      switch (keyCode) {
        case DOWN_KEY:
          UserPickerActions.setHighlightIndex(this.props.highlightIndex + 1)
          this.scroll('down', this.refs.picker)
          break;
        case UP_KEY:
          UserPickerActions.setHighlightIndex(this.props.highlightIndex - 1)
          this.scroll('up', this.refs.picker)
          break;
        case ENTER_KEY:
        case TAB_KEY:
          this.props.onUserSelected(this.props.users.get(this.props.highlightIndex))
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

    this.props.onUserSelected(u)

    UserPickerActions.clearUsers()
  }

  _scroll(direction, ref) {
    const pickerNode = React.findDOMNode(ref)
    const scrollHeight = pickerNode.scrollHeight

    if (scrollHeight > ref.props.maxHeight) {
      const inc = scrollHeight / this.props.users.count()

      if (direction === 'down') {
        this.scrollDown(pickerNode, inc, scrollHeight)
      } else if (direction === 'up') {
        this.scrollUp(pickerNode, inc, scrollHeight)
      }
    }
  }

  _scrollDown(node, inc, scrollHeight) {
    const scrollTop = node.scrollTop
    node.scrollTop = scrollTop + inc > scrollHeight ?
      scrollHeight :
      scrollTop + inc
  }

  _scrollUp(node, inc, scrollHeight) {
    const scrollTop = node.scrollTop
    node.scrollTop = scrollTop - inc < 0 ?
      0 :
      scrollTop - inc
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
