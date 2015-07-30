// https://github.com/rackt/react-router/blob/v0.13.3/docs/guides/testing.md
import React from 'react'

export default function(Component, props, stubs) {
  function RouterStub() { }

  Object.assign(RouterStub, {
    makePath() {},
    makeHref() {},
    transitionTo() {},
    replaceWith() {},
    goBack() {},
    getCurrentPath() {},
    getCurrentRoutes() {},
    getCurrentPathname() {},
    getCurrentParams() {},
    getCurrentQuery() {},
    isActive() {},
    getRouteAtDepth() {},
    setRouteComponentAtDepth() {},
  }, stubs)

  return class StubbedRouterComponent extends React.Component {
    static childContextTypes = {
      router: React.PropTypes.func,
      routeDepth: React.PropTypes.number,
    }

    getChildContext() {
      return {
        router: RouterStub,
        routeDepth: 0,
      }
    }

    render() {
      return <Component {...props} ref="stub" />
    }
  }
}
