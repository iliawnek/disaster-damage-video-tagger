<script>
export default {
  name: 'agency-header',

  props: [
    'agency',
  ],
}
</script>

<template lang="pug">
  md-content.agency-header.md-elevation-10
    img.image.md-elevation-10(:src="agency.logo")
    .name {{agency.name}}
    .description {{agency.description}}
    a.website(v-if="agency.website" :href="agency.website") {{agency.website}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .agency-header
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    padding: 32px 16px
    background-color: #333
  .content
    margin: 16px
  .image
    @extend .content
    width: 100px
    height: 100px
    border-radius: 4px
    background-color: white
  .text
    @extend .content
    color: white
  .name
    @extend .text
    font-size: 2.5em
    line-height: 1.2em
    text-transform: uppercase
    font-weight: bold
  .description
    @extend .text
    font-size: 1.1em
    max-width: 600px
    line-height: 1.5em
  .website
    @extend .text
    font-size: 0.9em
    font-weight: bold
    text-decoration: none !important
    color: white !important
  .website:hover
    color: $md-primary !important
</style>
