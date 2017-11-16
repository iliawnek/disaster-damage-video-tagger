<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'right-drawer',

  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),
    ...mapGetters({
      signedIn: 'auth/signedIn',
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
    }),
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
</template>

<style scoped lang="sass">
</style>
