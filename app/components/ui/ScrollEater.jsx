import React from 'react'

export default class ScrollEater extends React.Component {
  constructor(props) {
    super(props)
    this.onWheel = this.onWheel.bind(this)
  }

  render() {
    return this.props.children
  }

  componentWillReceiveProps(next) {
    this.unlisten()
    this.listen(next)
  }

  componentDidMount() {
    this.listen(this.props)
  }

  componentWillUnmount() {
    this.unlisten()
  }

  listen(props) {
    let el = React.findDOMNode(props.element || this)
    el.addEventListener("mousewheel", this.onWheel, false)
  }

  unlisten() {
    let el = React.findDOMNode(this.props.element || this)
    el.removeEventListener('mousewheel', this.onWheel)
  }

  onWheel(e) {
    e.preventDefault()
    let el = React.findDOMNode(this.props.element || this)
    el.scrollTop = el.scrollTop + e.deltaY
  }
}
