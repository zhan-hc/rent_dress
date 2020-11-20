export default {
  $_setUser (state, value) {
    state.rent_user = value
    localStorage.setItem('rent_user', value)
  },
  $_removeUser (state, value) {
    localStorage.removeItem('rent_user')
    state.rent_user = ''
  }
}
