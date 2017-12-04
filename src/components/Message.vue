<script>
export default {
  name: 'message',

  props: {
    message: String,
    icon: String,
  },
}
</script>

<template lang="pug">
  md-content.md-primary
    md-icon {{icon}}
    span#message {{message}}
</template>

<style scoped lang="sass">
  .md-content
    padding: 24px
  .md-icon
    margin-right: 16px
  #message
    font-weight: bold
</style>
