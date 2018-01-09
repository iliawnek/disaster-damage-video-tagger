<script>
export default {
  name: 'tag-card',

  props: [
    'tag',
  ],
}
</script>

<template lang="pug">
  md-card.tag-card
    md-card-media(md-ratio="1:1").media
      img.image(
      :src="tag.crop.images.highlighted"
      )
</template>

<style scoped lang="sass">
  .tag-card
    margin: 32px
    width: calc(100% - 64px)
    height: 200px
  .media
    height: 100%
    width: 30vw
    background-color: black
</style>
