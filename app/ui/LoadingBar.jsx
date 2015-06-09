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
    if (this.props.loading) {
      this.setTimeout()
    }
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timeout)
    if (nextProps.loading) {
      this.setTimeout()
    }
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

  setTimeout() {
    this.timeout = setTimeout(() => {
      this.setState({show: true})
    }, TimeoutMs)
  }

}

LoadingBar.propTypes = {
  loading: React.PropTypes.bool
}
