import debounce from '../lib/debounce'
import React from 'react'

export default class ScrollPaginator extends React.Component {
  constructor() {
    super()
    this.onScroll = this.onScroll.bind(this)
    this.timeout = null
  }

  componentDidMount() {
    this.listen()
  }

  componentWillUnmount() {
    this.unlisten()
  }

  componentWillReceiveProps(next) {
    if (next.page != this.props.page) {
      this.listen()
    }
  }

  listen() {
    if (__DEV__ && !this.props.element) {
      console.log(`No 'element' prop provided! Scroll paginator will be bound to window.`)
    }
    (this.props.element || window).addEventListener('scroll', this.onScroll)
  }

  unlisten() {
    (this.props.element || window).removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    if (this.atBottom()) {
      debounce(this.props.onScrollBottom, this)()
      this.unlisten()
    }
  }

  atBottom() {
    var body = this.props.element || document.body
    var html = this.props.container || document.documentElement

    var height = Math.max( body.scrollHeight, body.offsetHeight,
                           html.clientHeight, html.scrollHeight, html.offsetHeight )

    var buffer = height * 0.25

    var scrollBottom = body.scrollTop + html.clientHeight
    return scrollBottom > (height - buffer)
  }

  render() {
    return <div/>
  }
}

ScrollPaginator.propTypes = {
  onScrollBottom: React.PropTypes.func.isRequired,
  page: React.PropTypes.number.isRequired,
  element: React.PropTypes.object,
  container: React.PropTypes.object
}
