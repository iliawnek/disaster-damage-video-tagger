<script>
export default {
  name: 'video-card',

  props: [
    'image',
  ],
}
</script>

<template lang="pug">
  md-card
    md-card-media-cover
      md-card-media(md-ratio="1:1")
        img(:src="image")
</template>

<style scoped lang="sass">
  .md-card
    margin: 8px
    max-width: 200px
  .md-card-media
    background-color: black
</style>
