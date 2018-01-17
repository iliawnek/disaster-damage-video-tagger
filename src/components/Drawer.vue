<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {mapBoolean, mapGettersWithParams} from '@/utilities'
import Label from '@/components/Label'

export default {
  name: 'drawer',

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
      key: 'isDrawerOpen',
      setTrue: 'openDrawer',
      setFalse: 'closeDrawer',
    }),
  },

  methods: {
    ...mapActions({
      signOut: 'auth/signOut',
      signInWithGoogle: 'auth/signInWithGoogle',
      loadAgencies: 'agency/loadAgencies',
    }),
    ...mapGettersWithParams({
      getLinkToAgency: 'agency/getLinkToAgency',
      isCurrentUserAnAgencyAdmin: 'agency/isCurrentUserAnAgencyAdmin',
    }),
    click (then) {
      this.isDrawerOpen = false
      if (then) then()
    },
  },
}
</script>

<template lang="pug">
  md-drawer(
  :md-active.sync="isDrawerOpen"
  )
    // sign in
    md-content.md-primary.not-signed-in(v-if="!isSignedIn")
      md-button.signin-button.md-raised(@click="signInWithGoogle") Enter with Google

    div(v-if="isSignedIn")
      // current user
      md-list.user-section.md-double-line
        md-list-item
          md-avatar
            img(:src="user.photoURL")
          .md-list-item-text
            span.display-name {{user.displayName}}
            span.email {{user.email}}
          md-button.md-raised(v-if="isSignedIn" @click="click(signOut)") Sign out
      md-divider

      // current user's agencies
      md-list
        md-subheader Your agencies
        md-list-item(
        v-for="agency in currentUsersAgencies"
        :key="agency['.key']"
        :to="getLinkToAgency(agency)"
        @click="click()"
        )
          span {{agency.name}}
          kl-label(
          v-if="isCurrentUserAnAgencyAdmin(agency)"
          text="Admin"
          )
    md-divider

    // navigation
    md-list
      md-subheader Navigation
      md-list-item(to="/" @click="click()")
        md-icon home
        span.md-list-item-text Home
      md-list-item(to="/browse" @click="click()")
        md-icon view_comfy
        span.md-list-item-text Browse
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .not-signed-in
    display: flex
    justify-content: center
    align-items: center
    height: 100px

  .user-section
    background-color: $md-primary
  .display-name
    color: white
    font-weight: bold
  .email
    color: white !important
</style>
