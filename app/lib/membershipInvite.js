export default {
  get() {
    return localStorage.getItem('membership_invite')
  },

  set(i) {
    localStorage.setItem('membership_invite', i)
  },

  remove() {
    localStorage.removeItem('membership_invite')
  }
}
