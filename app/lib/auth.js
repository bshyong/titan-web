var _jwt = null

export default {
  jwt() {
    return _jwt || localStorage.getItem('jwt')
  },

  set(jwt) {
    _jwt = jwt
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('jwt', jwt)
      document.cookie = `jwt=${jwt}; path=/`
    }
  },

  remove() {
    _jwt = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('jwt')
    }
  }
}
