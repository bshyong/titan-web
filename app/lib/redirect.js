const KEY = 'return_url'

export default {
  get() {
    const href = localStorage.getItem(KEY) || '/'
    localStorage.removeItem(KEY)
    return href
  },

  remove() {
    localStorage.removeItem(KEY)
  },

  set(href) {
    localStorage.setItem(KEY, href)
  },
}
