import LoadingBar from './LoadingBar.jsx'
import React from 'react'

export default class ClickablePaginator extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div>
          {this.props.children}
        </div>
        <LoadingBar loading={this.props.loading} />
        {this.renderLoadMoreButton()}
      </div>
    )
  }

  renderLoadMoreButton() {
    if (this.props.loading) {
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
          onClick={this.props.onLoadMore}>
          <div className="orange mx-auto">Load more</div>
        </div>
      )
    }
  }
}

ClickablePaginator.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  onLoadMore: React.PropTypes.func.isRequired,
  hasMore: React.PropTypes.bool.isRequired,
}
