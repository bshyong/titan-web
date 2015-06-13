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
          <div className='m2 mt3'>
            <LoadingBar loading={this.state.loading} />
            {this.renderLoadMoreButton()}
          </div>
        </div>

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
          className="pointer p2 bg-smoke-hover gray orange-hover border-top block right-align"
          onClick={this.handleOnClick.bind(this)}>
          <div className="mx-auto h5">Load more</div>
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
