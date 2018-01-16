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
      openDrawer: 'ui/openDrawer',
    }),
  },
}
</script>

<template lang="pug">
  md-toolbar
      md-button.md-icon-button(@click="openDrawer")
        md-icon menu
      h3.md-title Disaster Damage Video Tagger
      md-button(v-if="!isSignedIn" @click="openDrawer") Sign in or register
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
