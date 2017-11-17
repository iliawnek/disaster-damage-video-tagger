<script>
import {mapMutations} from 'vuex'

export default {
  name: 'browse-videos',
  methods: {
    ...mapMutations({
      openNewVideoDialog: 'ui/openNewVideoDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-empty-state(
  md-icon="video_library"
  md-label="We're out of videos!"
  md-description="You can submit a video now, or check here later."
  )
    md-button.md-raised.md-primary(@click="openNewVideoDialog") Submit video
</template>

<style scoped lang="sass">
</style>
