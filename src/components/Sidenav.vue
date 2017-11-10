<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'sidenav',
  computed: {
    ...mapState({
      isShown: state => state.ui.isSidenavShown,
      user: state => state.auth.user,
    }),
    ...mapGetters({
      signedIn: 'auth/signedIn',
    }),
  },
  watch: {
    isShown (isShown) {
      if (isShown) this.$refs.sidenav.open()
      else this.$refs.sidenav.close()
    },
  },
  methods: {
    ...mapMutations({
      hideSidenav: 'ui/hideSidenav',
    }),
    ...mapActions({
      signOut: 'auth/signOut',
    }),
  },
}
</script>

<template lang="pug">
  md-sidenav(
    class="md-left"
    ref="sidenav"
    @close="hideSidenav"
  )
    md-list(v-if="signedIn")
      md-list-item
        md-avatar(class="md-avatar-icon")
          md-icon person
        .md-list-text-container
          span {{user && user.email}}
        md-list-expand
          md-list
            md-list-item(class="md-inset" @click="signOut") Sign out
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
