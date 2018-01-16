<script>
export default {
  name: 'event-header',

  props: [
    'event',
    'image',
  ],
}
</script>

<template lang="pug">
  md-content.event-header.md-elevation-10
    // background
    img.image(v-if="image" :src="image")
    .overlay

    // text
    .name {{event.name}}
    .description {{event.description}}
</template>

<style scoped lang="sass">
  .event-header
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    position: relative
    width: 100%
    padding: 32px 16px

  .background
    position: absolute
    width: 100%
    height: 100%
  .image
    @extend .background
    object-fit: cover
  .overlay
    @extend .background
    background-color: rgba(0,0,0,0.6)

  .text
    color: white
    z-index: 1
    margin: 8px
  .name
    @extend .text
    font-size: 2.5em
    line-height: 1.2em
    text-transform: uppercase
    font-weight: bold
  .description
    @extend .text
    font-size: 1.1em
    max-width: 500px
    line-height: 1.5em
</style>
