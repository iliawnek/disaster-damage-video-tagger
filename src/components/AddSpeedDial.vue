<script>
export default {
  name: 'add-speed-dial',
}
</script>

<template lang="pug">
  md-speed-dial.md-bottom-right(md-direction="top")
    md-speed-dial-target
      md-icon add
    md-speed-dial-content
      md-button.md-icon-button.md-transparent
        md-icon people
      md-button.md-icon-button.md-transparent
        md-icon event
</template>

<style scoped lang="sass">

</style>
