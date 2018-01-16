<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'toolbar',

  computed: {
    ...mapGetters({
      isSignedIn: 'auth/isSignedIn',
    }),
  },

  methods: {
    ...mapMutations({
      openNavigationDrawer: 'ui/openNavigationDrawer',
      openUserDrawer: 'ui/openUserDrawer',
    }),
  },
}
</script>

<template lang="pug">
  md-toolbar
      md-button.md-icon-button(@click="openNavigationDrawer")
        md-icon menu
      h3.md-title {{this.$route.name}}
      md-button(v-if="!isSignedIn" @click="openUserDrawer") Sign in or register
      md-button.md-icon-button(v-if="isSignedIn" @click="openUserDrawer")
        md-icon person
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
