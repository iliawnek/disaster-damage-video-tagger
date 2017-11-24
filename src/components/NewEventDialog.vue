<script>
import {mapGetters, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'
import {required, minLength} from 'vuelidate/lib/validators'

export default {
  name: 'new-event-dialog',

  created () {
    this.loadAgencies()
  },

  data () {
    return {
      form: {
        name: null,
        agencies: [],
      },
    }
  },

  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
      },
      agencies: {
        required,
      },
    },
  },

  computed: {
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewEventDialogOpen',
      setTrue: 'openNewEventDialog',
      setFalse: 'closeNewEventDialog',
    }),

    ...mapGetters({
      agencyNames: 'agency/agencyNames',
      agencyIdsByName: 'agency/agencyIdsByName',
    }),
  },

  methods: {
    ...mapActions({
      saveNewEvent: 'event/saveNewEvent',
      loadAgencies: 'agency/loadAgencies',
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
      this.form.name = null
      this.form.agencies = []
    },

    validateEvent () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        // transform list of agency names into agencyId index
        const agencies = {}
        this.form.agencies.forEach((agencyId) => {
          agencies[agencyId] = true
        })
        // save event
        this.saveNewEvent({
          event: {
            ...this.form,
            agencies,
          },
        })
        this.isNewEventDialogOpen = false
      }
    },
  },
}
</script>

<template lang="pug">
  md-dialog(
  :md-active.sync="isNewEventDialogOpen"
  @md-closed="clearForm"
  :md-close-on-esc="false"
  :md-click-outside-to-close="false"
  )
    md-dialog-title Create new event
    form(novalidate @submit.prevent="validateEvent")
      md-dialog-content
        // Event name
        md-field(:class="getValidationClass('name')")
          label(for="event-name") Event name
          md-input(
          name="event-name"
          id="event-name"
          v-model="form.name"
          )
          span.md-error(v-if="!$v.form.name.required") An event must have a name.
          span.md-error(v-else-if="!$v.form.name.minlength") Must be at least 3 letters long.

        // Associated agencies
        md-field(:class="getValidationClass('agencies')")
          label(for="agencies") Assigned agencies
          md-select(
          v-model="form.agencies"
          name="agencies"
          id="agencies"
          multiple
          md-dense
          )
            md-option(
            v-for="(id, name) in agencyIdsByName"
            :key="id"
            :value="id"
            ) {{name}}
          span.md-error(v-if="!$v.form.agencies.required") An event must be assigned to at least one agency.

      md-dialog-actions
        md-button.md-secondary(type="submit" @click="isNewEventDialogOpen = false") Cancel
        md-button.md-primary(type="submit") Create
</template>
