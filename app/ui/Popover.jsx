import React from 'react/addons'
import Icon from './Icon.jsx'
import TimeoutTransitionGroup from './TimeoutTransitionGroup.jsx'

const EscKeyCode = 27

export default class Popover extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      togglerWidth: 32
    }
    this.handleToggle = this._handleToggle.bind(this)
    this.handleDocumentClick = this._handleDocumentClick.bind(this)
    this.handleDocumentKeyup = this._handleDocumentKeyup.bind(this)
    this.setOpenState = this._setOpenState.bind(this)
  }

  componentDidMount() {
    this.setState({
      toggleWidth: this.refs.toggler.getDOMNode().offsetWidth
    })
  }

  componentWillUnmount() {
    this.unbindDocumentHandlers()
  }

  render() {
    const { children } = this.props
    return (
      <div className="relative">
        <div className="pointer" onClick={this.handleToggle} ref="toggler">
          {children}
        </div>
        <TimeoutTransitionGroup enterTimeout={300} leaveTimeout={300} transitionName="popover-content">
          {this.content()}
        </TimeoutTransitionGroup>
      </div>
    )
  }

  content() {
    const { content } = this.props
    const { togglerWidth } = this.state

    if (!this.state.open) {
      return
    }

    return (
      <div className="popover-content right-0" key="popover-content">
        <div className="mt1 bg-white rounded shadow relative overflow-hidden">
          {content}
        </div>
        <div className="popover-content-arrow" style={{right: (togglerWidth / 2)}} />
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
  content: React.PropTypes.node.isRequired
}
