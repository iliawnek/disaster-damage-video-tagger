<script>
import {mapActions} from 'vuex'
import VideoTagger from '@/components/VideoTagger'

export default {
  name: 'Video',

  components: {
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
</template>

<style scoped lang="sass">
</style>
