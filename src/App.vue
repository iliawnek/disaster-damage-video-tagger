<script>
import Toolbar from '@/components/Toolbar'
import Drawer from '@/components/Drawer'
import NewAgencyDialog from '@/components/NewAgencyDialog'
import NewEventDialog from '@/components/NewEventDialog'
import NewVideoDialog from '@/components/NewVideoDialog'

export default {
  name: 'app',
  components: {
    Toolbar,
    Drawer,
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
    drawer
    new-agency-dialog
    new-event-dialog
    new-video-dialog
    #content
      router-view
</template>

<style lang="sass">
@import '~vue-material/dist/vue-material.min.css'
@import '~vue-material/dist/theme/engine'
@import 'styles/theme'

@include md-register-theme('default', $md-theme)

@import '~vue-material/dist/theme/all' // apply the theme

@import url('//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic')
@import url('//fonts.googleapis.com/icon?family=Material+Icons')

@import '~video.js/dist/video-js.css'

html
  $font-stack: Roboto, sans-serif
  /*overflow: hidden*/

// required because dropdown menus don't render properly within dialogs
.md-menu-content
  z-index: 1000 !important

// minimum width on all dialogs
.md-dialog
  min-width: 400px
</style>
