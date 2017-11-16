<script>
import {mapState} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'new-agency-dialog',
  computed: {
    ...mapState({
      isNewAgencyDialogOpen: 'ui/isNewAgencyDialogOpen',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewAgencyDialogOpen',
      setTrue: 'openNewAgencyDialog',
      setFalse: 'closeNewAgencyDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-dialog(:md-active.sync="isNewAgencyDialogOpen")
    md-dialog-title Create new agency
</template>

<style scoped lang="sass">

</style>
