<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'register-dialog',
  data () {
    return {
      email: '',
      password: '',
      passwordAgain: '',
    }
  },
  computed: {
    ...mapState({
      isShown: state => state.ui.isRegisterDialogShown,
    }),
    ...mapGetters({
      signedIn: 'auth/signedIn',
    }),
  },
  watch: {
    isShown (isShown) {
      if (isShown) this.$refs.dialog.open()
      else this.$refs.dialog.close()
    },
    signedIn (signedIn) {
      if (signedIn) this.hideRegisterDialog()
    },
  },
  methods: {
    ...mapMutations({
      hideRegisterDialog: 'ui/hideRegisterDialog',
    }),
    ...mapActions({
      register: 'auth/register',
    }),
  },
}
</script>

<template lang="pug">
  md-dialog(ref="dialog" @close="hideRegisterDialog")
    md-dialog-title Register
    md-dialog-content
      form
        md-input-container
          label Email address
          md-input(v-model="email")
        md-input-container(md-has-password)
          label Password
          md-input(v-model="password" type="password")
        md-input-container(md-has-password)
          label Confirm password
          md-input(v-model="passwordAgain" type="password")
    md-dialog-actions
      md-button(class="md-primary" @click="hideRegisterDialog") Cancel
      md-button(class="md-primary" @click="register({email, password})") Register
</template>

<style scoped lang="sass">
  .md-title
    flex: 1
</style>
