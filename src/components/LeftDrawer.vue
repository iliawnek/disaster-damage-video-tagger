<script>
import {mapMutations} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'left-drawer',

  computed: {
    ...mapBoolean({
      namespace: 'ui',
      key: 'isLeftDrawerShown',
      setTrue: 'showLeftDrawer',
      setFalse: 'hideLeftDrawer',
    }),
  },

  methods: {
    ...mapMutations({
      showLeftDrawer: 'ui/showLeftDrawer',
      hideLeftDrawer: 'ui/hideLeftDrawer',
    }),
  },
}
</script>

<template lang="pug">
  md-drawer(
      :md-active.sync="isLeftDrawerShown"
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
