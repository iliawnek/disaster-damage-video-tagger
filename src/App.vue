<script>
import Toolbar from '@/components/Toolbar'
import LeftDrawer from '@/components/LeftDrawer'
import RightDrawer from '@/components/RightDrawer'
import NewAgencyDialog from '@/components/NewAgencyDialog'
import NewEventDialog from '@/components/NewEventDialog'
import NewVideoDialog from '@/components/NewVideoDialog'

export default {
  name: 'app',
  components: {
    Toolbar,
    LeftDrawer,
    RightDrawer,
    NewAgencyDialog,
    NewEventDialog,
    NewVideoDialog,
  },
  data () {
    return {
      email: '',
      password: '',
      passwordAgain: '',
    }
  },
  beforeCreate () {
    this.$store.dispatch('auth/getUser')
  },
}
</script>

<template lang="pug">
  #app
    toolbar
    left-drawer
    right-drawer
    new-agency-dialog
    new-event-dialog
    new-video-dialog
    #content
      router-view
</template>

<style lang="sass">
@import '~vue-material/dist/vue-material.min.css'
@import url('//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic')
@import url('//fonts.googleapis.com/icon?family=Material+Icons')
@import '~vue-material/dist/theme/engine'
@include md-register-theme('default', (primary: md-get-palette-color(blue, A200), accent: md-get-palette-color(red, A200)))
@import '~vue-material/dist/theme/all'

html
  $font-stack: Roboto, sans-serif
  overflow: hidden
</style>
