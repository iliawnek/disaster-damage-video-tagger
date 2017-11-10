<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'sign-in-dialog',
  data () {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapState({
      isShown: state => state.ui.isSignInDialogShown,
    }),
    ...mapGetters({
      signedIn: 'auth/signedIn',
    }),
  },
  watch: {
    isShown (isShown, wasShown) {
      if (isShown) this.$refs.dialog.open()
      else this.$refs.dialog.close()
    },
    signedIn (signedIn) {
      if (signedIn) this.hideSignInDialog()
    },
  },
  methods: {
    ...mapMutations({
      hideSignInDialog: 'ui/hideSignInDialog',
    }),
    ...mapActions({
      signIn: 'auth/signIn',
    }),
  },
}
</script>

<template lang="pug">
  md-dialog(ref="dialog" @close="hideSignInDialog")
    md-dialog-title Sign in
    md-dialog-content
      form
        md-input-container
          label Email address
          md-input(v-model="email")
        md-input-container(md-has-password)
          label Password
          md-input(v-model="password" type="password")
    md-dialog-actions
      md-button(class="md-primary" @click="hideSignInDialog") Cancel
      md-button(class="md-primary" @click="signIn({email, password})") Sign in
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
