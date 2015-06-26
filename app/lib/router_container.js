import SessionStore from '../stores/session_store'
import url from 'url'

var _customDomain = null
var _routers = null

var _mainUrl = url.parse(MAIN_HOST)

export default {
  isCurrentDomain(test) {
    if (!test) {
      return true
    }

    return test === _customDomain
  },

  isMainSite() {
    return !_customDomain
  },

  setDomain(domain) {
    if (domain !== _mainUrl.hostname) {
      _customDomain = domain
    }
  },

  setRouters(routers) {
    _routers = routers
  },

  get() {
    return this.router
  },

  get mainDomain() {
    return _mainUrl.hostname
  },

  get customDomain() {
    return _customDomain
  },

  get router() {
    return this.isMainSite() ?
      _routers.internal :
      _routers.external
  },

  get routers() {
    return _routers
  },

  transitionTo() {
    return this.router.transitionTo.apply(this.router, arguments)
  },

  changelogSlug(params) {
    if (_customDomain) {
      return _customDomain
    }

    params = params || this.router.getCurrentParams()

    return params && params.changelogId
  },

  fullUrl(hostname, path, query={}) {
    if (SessionStore.isSignedIn()) {
      query.a = '1' // request auto sign in on custom domain
    }

    return url.format({
      port: _mainUrl.port,
      protocol: _mainUrl.protocol,
      hostname: (hostname || _mainUrl.hostname),
      pathname: path,
      query: query
    })
  }
}
