import React from 'react'

const zIndex = 100
const ESC_KEY = 27

export default class Dialog extends React.Component {
  static propTypes = {
    onCloseRequested: React.PropTypes.func
  }

  componentDidMount() {
    this.handleKeyDown = this.handleKeyDown.bind(this)
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    return (
      <div className="fixed top-0 left-0 full-width bg-darken-4 flex flex-center"
           style={{zIndex, minHeight: '100vh'}}
           onClick={this.handleOuterClick.bind(this)}>
        <div className="relative shadow rounded overflow-hidden bg-white m2 full-width sm-mx-auto sm-col-8 md-col-6 lg-col-4"
             onClick={this.handleInnerClick.bind(this)}>
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

  handleInnerClick(e) {
    e.stopPropagation()
  }

  handleOuterClick(e) {
    this.props.onCloseRequested && this.props.onCloseRequested()
  }
}
