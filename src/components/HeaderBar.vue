<script>
export default {
  name: 'header-bar',
}
</script>

<template lang="pug">
  header
    .title
      router-link(:to="{name: 'Home'}") DISASTER DAMAGE VIDEO TAGGER
</template>

<style scoped lang="sass">
header
  display: flex
  align-items: center
  width: 100vw
  height: 80px
  padding: 28px
  font-size: 20px
</style>
