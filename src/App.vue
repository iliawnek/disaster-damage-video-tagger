<script>
import HeaderBar from '@/components/HeaderBar'

export default {
  name: 'app',
  components: {
    HeaderBar,
  },
}
</script>

<template lang="pug">
  #app
    header-bar
    .container
      router-view
</template>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Rubik:400,700')

$font-stack: Rubik, sans-serif

#app
  font-size: 20px
  font-family: $font-stack
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  display: flex
  flex-direction: column
  justify-content: center
.container
  padding: 20px 28px
div, header
  box-sizing: border-box
</style>
