import LoadingBar from './LoadingBar.jsx'
import React from 'react'
import Icon from 'ui/Icon.jsx'

export default class ClickablePaginator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  componentWillReceiveProps() {
    this.setState({
      loading: false,
    })
  }

  render() {
    return (
      <div>
        {this.props.children}
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
          className="flex flex-center pointer p2 gray orange-hover border-top border-smoke"
          onClick={this.handleOnClick.bind(this)}>
          <div className="inline-block bg-smoke rounded px1 mr1">
            <Icon icon="ellipsis-h" color="silver" />
          </div>
          <div className="sm-show h6">
            Load more
          </div>
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
