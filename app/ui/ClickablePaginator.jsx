import LoadingBar from './LoadingBar.jsx'
import React from 'react'

export default class ClickablePaginator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  componentWillReceiveProps() {
    this.setState({
      loading: false
    })
  }

  render() {
    return (
      <div>
        <div>
          {this.props.children}
        </div>
        <LoadingBar loading={this.state.loading} />
        {this.renderLoadMoreButton()}
      </div>
    )
  }

  renderLoadMoreButton() {
    if (this.state.loading) {
      return (
        <div
          className="flex flex-center pointer py1">
          <div className="gray mx-auto">Loading..</div>
        </div>
      )
    }

    if (this.props.hasMore) {
      return (
        <div
          className="flex flex-center pointer py1 button-transparent orange"
          onClick={this.handleOnClick.bind(this)}>
          <div className="orange mx-auto">Load more</div>
        </div>
      )
    }
  }

  handleOnClick() {
    this.setState({
      loading: true
    }, this.props.onLoadMore)
  }
}

ClickablePaginator.propTypes = {
  onLoadMore: React.PropTypes.func.isRequired,
  hasMore: React.PropTypes.bool.isRequired,
}
