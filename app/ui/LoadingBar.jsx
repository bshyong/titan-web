import React from 'react'

export default class LoadingBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
    this.timeout = null
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({show: true})
    }, 600)
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
}

LoadingBar.propTypes = {
  loading: React.PropTypes.bool
}
