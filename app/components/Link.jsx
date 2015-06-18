import { Link } from 'react-router'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import url from 'url'

export default class AppLink extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  render() {
    if (RouterContainer.isMainSite()) {
      return this.renderForMainSite()
    } else {
      return this.renderForCustomDomain()
    }
  }

  renderForMainSite() {
    if (this.domain()) {
      return this.renderFullUrl(RouterContainer.routers.external)
    }

    return <Link {...this.props} />
  }

  renderForCustomDomain() {
    let routeFound = this.context.router.namedRoutes[this.props.to]
    if (this.changelogId() || !routeFound) {
      // either a changelog without a custom domain, or a route we don't have
      return this.renderFullUrl(RouterContainer.routers.internal)
    }

    if (this.domain() && !RouterContainer.isCurrentDomain(this.domain())) {
      // domain supplied but it's not this current one
      return this.renderFullUrl(RouterContainer.routers.external)
    }

    return <Link {...this.props} />
  }

  renderFullUrl(router) {
    var route = router.namedRoutes[this.props.to]
    var path = router.makeHref(this.props.to, this.props.params)
    var href = RouterContainer.fullUrl(this.domain(), path, this.props.query)

    return <a {...this.props} href={href}>{this.props.children}</a>
  }

  domain() {
    let { params } = this.props
    if (!params) {
      return
    }

    if (params.domain) {
      return params.domain
    }

    if (params.changelogId && params.changelogId.indexOf('.') !== -1) {
      return params.changelogId
    }
  }

  changelogId() {
    let { params } = this.props
    if (!params) {
      return
    }

    if (params.changelogId && params.changelogId.indexOf('.') === -1) {
      return params.changelogId
    }
  }
}
