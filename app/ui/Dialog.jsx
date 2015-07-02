import React from 'react'

const zIndex = 100
const ESC_KEY = 27

export default class Dialog extends React.Component {
  static propTypes = {
    invisible: React.PropTypes.bool,
    onCloseRequested: React.PropTypes.func
  }

  componentDidMount() {
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleOuterClick = this.handleOuterClick.bind(this)
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('click', this.handleOuterClick)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('click', this.handleOuterClick)
  }

  render() {
    if (this.props.invisible) {
      return <div ref="inner">{this.props.children}</div>
    }

    return (
      <div className="fixed top-0 left-0 full-width bg-darken-4 flex flex-center"
           style={{zIndex, minHeight: '100vh'}}>
        <div ref="inner" className="relative shadow rounded overflow-hidden bg-white m2 full-width sm-mx-auto sm-col-8 md-col-6 lg-col-4">
          {this.props.children}
        </div>
      </div>
    )
  }

  handleKeyDown(e) {
    if (e.keyCode === ESC_KEY) {
      this.props.onCloseRequested && this.props.onCloseRequested()
    }
  }

  handleOuterClick(e) {
    if (!React.findDOMNode(this.refs.inner).contains(e.target)) {
      this.props.onCloseRequested && this.props.onCloseRequested()
    }
  }
}
