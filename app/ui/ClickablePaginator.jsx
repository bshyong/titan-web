import debounce from '../lib/debounce'
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
        {this.renderLoadMoreButton()}
      </div>
    )
  }

  renderLoadMoreButton() {
    if (this.props.hasMore) {
      return (
        <div className="flex flex-center pointer py1 button-transparent orange">
          <div className="orange mx-auto" onClick={this.props.onLoadMore}>Load more</div>
        </div>
      )
    }
  }
}

ClickablePaginator.propTypes = {
  onLoadMore: React.PropTypes.func.isRequired,
  hasMore: React.PropTypes.bool.isRequired,
}
