<script>
import {mapMutations} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'navigation-drawer',

  computed: {
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNavigationDrawerOpen',
      setTrue: 'openNavigationDrawer',
      setFalse: 'closeNavigationDrawer',
    }),
  },

  methods: {
    ...mapMutations({
      openNavigationDrawer: 'ui/openNavigationDrawer',
      closeNavigationDrawer: 'ui/closeNavigationDrawer',
    }),
  },
}
</script>

<template lang="pug">
  md-drawer(
  :md-active.sync="isNavigationDrawerOpen"
  )
    md-toolbar.md-medium.md-primary
      h3.md-title Disaster Damage Video Tagger
    md-list
      md-list-item(to="/" @click="closeNavigationDrawer")
        md-icon home
        span.md-list-item-text Home
      md-list-item(to="/browse" @click="closeNavigationDrawer")
        md-icon view_comfy
        span.md-list-item-text Browse
</template>

<style scoped lang="sass">
</style>
