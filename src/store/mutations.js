export default {
  $_setUser (state, value) {
    state.rent_user = value
    localStorage.setItem('rent_user', value)
  },
  $_removeUser (state, value) {
    localStorage.removeItem('rent_user')
    state.rent_user = ''
  },
  $_setUserId (state, value) {
    state.rent_userId = value
    localStorage.setItem('rent_userId', value)
  },
  $_removeUserId (state, value) {
    localStorage.removeItem('rent_userId')
    state.rent_userId = ''
  }
}
