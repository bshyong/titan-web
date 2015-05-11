import React from 'react'

export default class ScrollPaginator extends React.Component {
  constructor() {
    super()
    this.onScroll = this.onScroll.bind(this)
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
    window.addEventListener('scroll', this.onScroll)
  }

  unlisten() {
    window.removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    if (this.atBottom()) {
      this.props.onScrollBottom()
      this.unlisten()
    }
  }

  atBottom() {
    var body = document.body,
        html = document.documentElement

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
  page: React.PropTypes.number.isRequired
}
