<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'right-drawer',

  created () {
    this.loadAgencies()
  },

  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),
    ...mapGetters({
      signedIn: 'auth/signedIn',
      currentUsersAgencies: 'agency/currentUsersAgencies',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isRightDrawerOpen',
      setTrue: 'openRightDrawer',
      setFalse: 'closeRightDrawer',
    }),
  },

  watch: {
  },

  methods: {
    ...mapMutations({
      openRightDrawer: 'ui/openRightDrawer',
      closeRightDrawer: 'ui/closeRightDrawer',
    }),
    ...mapActions({
      signOut: 'auth/signOut',
      signInWithGoogle: 'auth/signInWithGoogle',
      loadAgencies: 'agency/loadAgencies',
    }),
    getLinkToAgency (agency) {
      return this.$store.getters['agency/getLinkToAgency'](agency)
    },
    isCurrentUserAnAgencyAdmin (agency) {
      return this.$store.getters['agency/isCurrentUserAnAgencyAdmin'](agency)
    },
  },
}
</script>

<template lang="pug">
  md-drawer(
  :md-active.sync="isRightDrawerOpen"
  md-right
  )
    div(v-if="!signedIn")
      md-button(@click="signInWithGoogle") Sign in with Google
    div(v-if="signedIn")
      md-list.md-double-line
        md-list-item
          md-avatar
            img(:src="user.photoURL")
          .md-list-item-text
            span {{user.displayName}}
            span {{user.email}}
          md-button(v-if="signedIn" @click="signOut") Sign out
        md-divider
        md-subheader Your agencies
        md-list-item(
        v-for="agency in currentUsersAgencies"
        :key="agency['.key']"
        :to="getLinkToAgency(agency)"
        )
          .md-list-item-text(v-if="isCurrentUserAnAgencyAdmin(agency)")
            span {{agency.name}}
            span admin
          span(v-else) {{agency.name}}
</template>

<style scoped lang="sass">
</style>
