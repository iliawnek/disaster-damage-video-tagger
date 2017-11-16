<script>
import {mapState} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'new-video-dialog',
  computed: {
    ...mapState({
      isNewVideoDialogOpen: 'ui/isNewVideoDialogOpen',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewVideoDialogOpen',
      setTrue: 'openNewVideoDialog',
      setFalse: 'closeNewVideoDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-dialog(:md-active.sync="isNewVideoDialogOpen")
    md-dialog-title Submit video
</template>

<style scoped lang="sass">

</style>
