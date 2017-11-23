import {db} from '^/firebase'

const agenciesRef = db.ref('agencies')
const usersRef = db.ref('users')

export default {
  namespaced: true,
  state: {
  },
  actions: {
    saveNewAgency ({rootState}, {agency, admin}) {
      // save agency
      const newAgencyRef = agenciesRef.push()
      const newAgencyId = newAgencyRef.key
      newAgencyRef.set({
        ...agency,
        admins: {
          [admin]: true,
        },
      })
      // save user
      const uid = rootState.auth.user.uid
      usersRef.child(uid).child('adminOf').update({
        [newAgencyId]: true,
      })
    },
  },
}
