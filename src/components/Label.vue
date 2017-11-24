<script>
export default {
  name: 'kl-label',

  props: [
    'text',
  ],
}
</script>

<template lang="pug">
  #label-container {{text}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  #label-container
    color: white
    text-transform: uppercase
    font-size: 11px
    font-weight: bold
    background-color: $md-primary
    padding: 4px
    border-radius: 4px
</style>
