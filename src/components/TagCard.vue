<script>
export default {
  name: 'tag-card',

  data () {
    return {
      zoomedIn: false,
    }
  },

  props: [
    'tag',
  ],

  computed: {
    imageSrc () {
      const {highlighted, cropped} = this.tag.crop.images
      return this.zoomedIn ? cropped : highlighted
    },
  },

  methods: {
    toggleZoom () {
      this.zoomedIn = !this.zoomedIn
    },
  },
}
</script>

<template lang="pug">
  md-card.tag-card
    img.image(
    :src="imageSrc"
    @click="toggleZoom"
    )
    .text
      ul
        li
          b details:&nbsp;
          | {{tag.details}}
        li
          b time:&nbsp;
          | {{tag.crop.time}}
        li
          b range:&nbsp;
          | {{tag.range}}
</template>

<style scoped lang="sass">
  .tag-card
    display: flex
    margin: 32px
    width: calc(100% - 64px)
    height: 200px
  .image
    height: 200px
    width: 200px
    object-fit: contain
    background-color: black
    cursor: zoom-in
</style>
