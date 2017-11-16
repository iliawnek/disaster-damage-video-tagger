<script>
import Toolbar from '@/components/Toolbar'
import LeftDrawer from '@/components/LeftDrawer'
import RightDrawer from '@/components/RightDrawer'

export default {
  name: 'app',
  components: {
    Toolbar,
    LeftDrawer,
    RightDrawer,
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
</template>

<style lang="sass">
@import url('//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic')
@import url('//fonts.googleapis.com/icon?family=Material+Icons')

html
  $font-stack: Roboto, sans-serif
</style>
