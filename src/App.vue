<script>
import Toolbar from '@/components/Toolbar'
import NavigationDrawer from '@/components/NavigationDrawer'
import UserDrawer from '@/components/UserDrawer'
import NewAgencyDialog from '@/components/NewAgencyDialog'
import NewEventDialog from '@/components/NewEventDialog'
import NewVideoDialog from '@/components/NewVideoDialog'

export default {
  name: 'app',
  components: {
    Toolbar,
    NavigationDrawer,
    UserDrawer,
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
    navigation-drawer
    user-drawer
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

html
  $font-stack: Roboto, sans-serif
  overflow: hidden

// required because dropdown menus don't render properly within dialogs
.md-menu-content
  z-index: 1000 !important
</style>
