import reqwest from 'reqwest'
import SessionStore from 'stores/session_store'

module.exports = {
  get(url) {
    return reqwest({
      url: `${API_URL}/${url}`,
      method: 'GET',
      headers: this.headers()
    })
  },

  post(url, data) {
    return reqwest({
      url: `${API_URL}/${url}`,
      data: data,
      method: 'POST',
      headers: this.headers()
    })
  },

  headers() {
    if (SessionStore.jwt) {
      return {
        'Authorization': 'Bearer ' + SessionStore.jwt
      }
    }
  }
}
