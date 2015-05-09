import React from 'react/addons'
import Icon from 'components/ui/icon.js.jsx'
const {addons: {CSSTransitionGroup}} = React

const EscKeyCode = 27

export default class Popover extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleToggle = this._handleToggle.bind(this)
    this.handleDocumentClick = this._handleDocumentClick.bind(this)
    this.handleDocumentKeyup = this._handleDocumentKeyup.bind(this)
    this.setOpenState = this._setOpenState.bind(this)
  }

  componentWillUnmount() {
    this.unbindRootCloseHandlers()
  }

  render() {
    const { trigger } = this.props
    return (
      <div className="relative">
        <div className="pointer" onClick={this.handleToggle}>
          {trigger}
        </div>
        <CSSTransitionGroup transitionName="popover-menu">
          {this.menu()}
        </CSSTransitionGroup>
      </div>
    )
  }

  menu() {
    const { children } = this.props

    if(!this.state.open) {
      return
    }

    return (
      <div className="popover-menu absolute right-0" key="popover-menu">
        <div className="py1 mt1 bg-white rounded shadow relative">
          { children }
        </div>
        <div className="popover-menu-arrow" />
      </div>
    )
  }

  bindDocumentHandlers() {
    document.addEventListener('click', this.handleDocumentClick)
    document.addEventListener('keyup', this.handleDocumentKeyup)
  }

  unbindDocumentHandlers() {
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('keyup', this.handleDocumentKeyup)
  }

  _handleDocumentClick(e) {
    if (!React.findDOMNode(this).contains(e.target)) {
      this.setOpenState(false)
    }
  }

  _handleDocumentKeyup(e) {
    if (e.keyCode === EscKeyCode) {
      this.setOpenState(false)
    }
  }

  _handleToggle(e) {
    e.preventDefault()
    this.setOpenState(!this.state.open)
  }

  _setOpenState(isOpen, cb) {
    if (isOpen) {
      this.bindDocumentHandlers()
    } else {
      this.unbindDocumentHandlers()
    }

    return this.setState({open: isOpen}, cb)
  }
}

Popover.propTypes = {
  trigger: React.PropTypes.node.isRequired
}
