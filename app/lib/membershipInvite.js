export default {
  get() {
    return localStorage.getItem('membershipInvite')
  },

  set(i) {
    localStorage.setItem('membershipInvite', i)
  },

  remove() {
    localStorage.removeItem('membershipInvite')
  }
}
