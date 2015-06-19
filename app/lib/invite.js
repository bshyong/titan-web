export default {
  get() {
    return localStorage.getItem('invite')
  },

  set(i) {
    localStorage.setItem('invite', i)
  },

  remove() {
    localStorage.removeItem('invite')
  }
}
