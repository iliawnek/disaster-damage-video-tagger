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
    isUserInAnyAgency () {
      return this.currentUsersAgencies.length > 0
    },
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
    // current user
    md-list.user-section.md-double-line(v-if="isSignedIn")
      md-list-item
        md-avatar
          img(:src="user.photoURL")
        .md-list-item-text
          span.display-name {{user.displayName}}
          span.email {{user.email}}
        md-button.md-raised(v-if="isSignedIn" @click="click(signOut)") Sign out
    md-divider

    // navigation
    md-list
      md-subheader Navigation
      md-list-item(to="/browse/videos" @click="click()")
        md-icon play_circle_filled
        span.md-list-item-text Videos
      md-list-item(to="/browse/events" @click="click()")
        md-icon event
        span.md-list-item-text Events
      md-list-item(to="/browse/agencies" @click="click()")
        md-icon people
        span.md-list-item-text Agencies
    md-divider

    // current user's agencies
    md-list(v-if="isSignedIn && isUserInAnyAgency")
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
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .user-section
    background-color: $md-primary
  .display-name
    color: white
    font-weight: bold
  .email
    color: white !important
</style>
