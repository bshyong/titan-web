import React from 'react'

export default class LoadingBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({show: true})
    }, 600)
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
  loading: React.PropTypes.bool.isRequired
}
