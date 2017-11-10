<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'toolbar',
  props: [
    'title',
  ],
  computed: {
    ...mapGetters({
      signedIn: 'auth/signedIn',
    }),
  },
  methods: {
    ...mapMutations({
      showSidenav: 'ui/showSidenav',
      showSignInDialog: 'ui/showSignInDialog',
      showRegisterDialog: 'ui/showRegisterDialog',
    }),
  },
}
</script>


<template lang="pug">
  md-toolbar
    md-button(class="md-icon-button" @click="showSidenav(true)")
      md-icon menu
    h2(class="md-title") {{title || this.$route.name}}
    md-button(v-if="!signedIn" class="md-raised" @click="showRegisterDialog(true)") Register
    md-button(v-if="!signedIn" class="md-raised" @click="showSignInDialog(true)") Sign in
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
