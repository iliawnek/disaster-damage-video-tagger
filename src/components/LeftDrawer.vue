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
        md-list-item
          md-icon move_to_inbox
          span.md-list-item-text Videos
        md-list-item
          md-icon send
          span.md-list-item-text Events
        md-list-item
          md-icon delete
          span.md-list-item-text Agencies
</template>

<style scoped lang="sass">
</style>
