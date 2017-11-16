<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'toolbar',

  computed: {
    ...mapGetters({
      signedIn: 'auth/signedIn',
    }),
  },

  methods: {
    ...mapMutations({
      showLeftDrawer: 'ui/showLeftDrawer',
      showRightDrawer: 'ui/showRightDrawer',
    }),
  },
}
</script>

<template lang="pug">
  md-toolbar
      md-button.md-icon-button(@click="showLeftDrawer")
        md-icon menu
      h3.md-title {{this.$route.name}}
      md-button(v-if="!signedIn" @click="showRightDrawer") Sign in or register
      md-button.md-icon-button(v-if="signedIn" @click="showRightDrawer")
        md-icon person
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
