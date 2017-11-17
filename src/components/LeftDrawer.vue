<script>
import {mapMutations} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'left-drawer',

  computed: {
    ...mapBoolean({
      namespace: 'ui',
      key: 'isLeftDrawerOpen',
      setTrue: 'openLeftDrawer',
      setFalse: 'closeLeftDrawer',
    }),
  },

  methods: {
    ...mapMutations({
      openLeftDrawer: 'ui/openLeftDrawer',
      closeLeftDrawer: 'ui/closeLeftDrawer',
    }),
  },
}
</script>

<template lang="pug">
  md-drawer(
      :md-active.sync="isLeftDrawerOpen"
    )
      md-list
        md-list-item(to="/" @click="closeLeftDrawer")
          md-icon home
          span.md-list-item-text Home
        md-list-item(to="/browse" @click="closeLeftDrawer")
          md-icon view_comfy
          span.md-list-item-text Browse
</template>

<style scoped lang="sass">
</style>
