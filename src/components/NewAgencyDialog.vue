<script>
import {mapState, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'
import {required, minLength} from 'vuelidate/lib/validators'

export default {
  name: 'new-agency-dialog',

  data () {
    return {
      form: {
        name: null,
      },
    }
  },

  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
      },
    },
  },

  computed: {
    ...mapState({
      uid: state => state.auth.user.uid,
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewAgencyDialogOpen',
      setTrue: 'openNewAgencyDialog',
      setFalse: 'closeNewAgencyDialog',
    }),
  },

  methods: {
    ...mapActions({
      saveNewAgency: 'agency/saveNewAgency',
    }),

    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$error,
        }
      }
    },

    clearForm () {
      this.$v.$reset()
      Object.keys(this.form).forEach(field => {
        this.form[field] = null
      })
    },

    validateAgency () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveNewAgency({
          agency: this.form,
          admin: this.uid,
        })
        this.isNewAgencyDialogOpen = false
      }
    },
  },
}
</script>

<template lang="pug">
  md-dialog(
  :md-active.sync="isNewAgencyDialogOpen"
  @md-closed="clearForm"
  :md-close-on-esc="false"
  :md-click-outside-to-close="false"
  )
    md-dialog-title Create new agency
    form(novalidate @submit.prevent="validateAgency")
      md-dialog-content
        md-field(:class="getValidationClass('name')")
          label(for="agency-name") Agency name
          md-input(
          name="agency-name"
          id="agency-name"
          v-model="form.name"
          )
          span.md-error(v-if="!$v.form.name.required") An agency must have a name.
          span.md-error(v-else-if="!$v.form.name.minlength") Must be at least 3 letters long.

      md-dialog-actions
        md-button.md-secondary(type="submit" @click="isNewAgencyDialogOpen = false") Cancel
        md-button.md-primary(type="submit") Create
</template>

<style scoped lang="sass">

</style>