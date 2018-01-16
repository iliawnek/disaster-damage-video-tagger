<script>
import VideoCard from '@/components/VideoCard'

export default {
  name: 'video-list',

  components: {
    'video-card': VideoCard,
  },

  props: [
    'videos',
  ],
}
</script>

<template lang="pug">
  .video-list
    video-card(
    v-for="video in videos"
    :key="video['.key']"
    :image="video.thumbnail"
    )
</template>

<style scoped lang="sass">

</style>
