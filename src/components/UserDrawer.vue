<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'
import Label from '@/components/Label'

export default {
  name: 'user-drawer',

  components: {
    'kl-label': Label,
  },

  created () {
    this.loadAgencies()
  },

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    ...mapGetters({
      isSignedIn: 'auth/isSignedIn',
      currentUsersAgencies: 'agency/currentUsersAgencies',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isUserDrawerOpen',
      setTrue: 'openUserDrawer',
      setFalse: 'closeUserDrawer',
    }),
  },

  methods: {
    ...mapMutations({
      openUserDrawer: 'ui/openUserDrawer',
      closeUserDrawer: 'ui/closeUserDrawer',
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
  :md-active.sync="isUserDrawerOpen"
  md-right
  )
    div(v-if="!isSignedIn")
      md-button(@click="signInWithGoogle") Sign in with Google
    div(v-if="isSignedIn")
      md-list.md-double-line
        md-list-item
          md-avatar
            img(:src="user.photoURL")
          .md-list-item-text
            span {{user.displayName}}
            span {{user.email}}
          md-button(v-if="isSignedIn" @click="signOut") Sign out
      md-divider
      md-list
        md-subheader Your agencies
        md-list-item(
        v-for="agency in currentUsersAgencies"
        :key="agency['.key']"
        :to="getLinkToAgency(agency)"
        )
          span {{agency.name}}
          kl-label(
          v-if="isCurrentUserAnAgencyAdmin(agency)"
          text="Admin"
          )
</template>

<style scoped lang="sass">
</style>
