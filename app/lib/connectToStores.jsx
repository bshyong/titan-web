import React from 'react'

export default function connectToStores(stores) {
  return function(Component) {
    return class StoreConnection extends React.Component {
      constructor(props) {
        super(props)
        this.state = Component.getPropsFromStores()
        this.handleStoresChanged = this.handleStoresChanged.bind(this)
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }

      componentDidMount() {
        stores.forEach(store =>
          store.addChangeListener(this.handleStoresChanged)
        );
      }

      componentWillUnmount() {
        stores.forEach(store =>
          store.removeChangeListener(this.handleStoresChanged)
        );
      }

      handleStoresChanged() {
        this.setState(Component.getPropsFromStores())
      }
    }
  }
}
