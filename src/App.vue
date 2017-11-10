<script>
import Toolbar from '@/components/Toolbar'
import Sidenav from '@/components/Sidenav'
import SignInDialog from './components/SignInDialog.vue'
import RegisterDialog from './components/RegisterDialog.vue'

export default {
  name: 'app',
  components: {
    Toolbar,
    Sidenav,
    SignInDialog,
    RegisterDialog,
  },
  beforeCreate () {
    this.$store.dispatch('auth/getUser')
  },
}
</script>

<template lang="pug">
  #app
    toolbar
    sidenav
    sign-in-dialog
    register-dialog
    .container
      router-view
</template>

<style lang="sass">
@import '../node_modules/vue-material/dist/vue-material.css'
@import url('//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic')
@import url('//fonts.googleapis.com/icon?family=Material+Icons')

$font-stack: Roboto, sans-serif

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
