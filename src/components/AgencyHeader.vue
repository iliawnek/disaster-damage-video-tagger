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
    .name {{agency.name}}
    .description {{agency.description}}
</template>

<style scoped lang="sass">
  .agency-header
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    padding: 32px 16px
    background-color: #666
  .text
    margin: 16px
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
</style>
