<script>
export default {
  name: 'kl-label',

  props: [
    'text',
  ],
}
</script>

<template lang="pug">
  .label-container.md-elevation-5
    .label-text {{text}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .label-container
    display: flex
    justify-content: center
    align-items: center
    background-color: white
    border-radius: 4px
  .label-text
    text-transform: uppercase
    font-weight: bold
    color: #222
    font-size: 0.75em
    line-height: 1em
    padding: 6px

</style>
