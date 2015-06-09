import React from 'react'

const TimeoutMs = 600

export default class LoadingBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
    this.timeout = null
  }

  componentDidMount() {
    this.toggleTimeout()
  }

  componentDidUpdate() {
    this.toggleTimeout()
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    if (!this.props.loading) {
      return <div />
    }

    if (!this.state.show) {
      return <div className="loading-bar" />
    }

    return (
      <div className="loading-bar loading-bar--shown flex">
        <div className="loading-bar-left" />
        <div className="loading-bar-right" />
      </div>
    )
  }

  toggleTimeout() {
    if (this.props.loading) {
      this.timeout = this.timeout || setTimeout(() => {
        this.setState({show: true})
        clearTimeout(this.timeout)
      }, TimeoutMs)
    } else {
      clearTimeout(this.timeout)
    }
  }

}

LoadingBar.propTypes = {
  loading: React.PropTypes.bool
}
