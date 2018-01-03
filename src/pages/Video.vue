<script>
import {mapActions} from 'vuex'
import NewTagDialog from '@/components/NewTagDialog'
import VideoTagger from '@/components/VideoTagger'

export default {
  name: 'Video',

  components: {
    'new-tag-dialog': NewTagDialog,
    'video-tagger': VideoTagger,
  },

  created () {
    const {videoId} = this.$route.params
    this.loadVideo({videoId})
  },

  methods: {
    ...mapActions({
      loadVideo: 'video/loadVideo',
    }),
  },
}
</script>

<template lang="pug">
  #video
    video-tagger
    new-tag-dialog
</template>

<style scoped lang="sass">
</style>
