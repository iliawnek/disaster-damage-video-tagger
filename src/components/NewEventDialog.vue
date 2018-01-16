<script>
import {mapGetters, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'
import {required, minLength, maxLength} from 'vuelidate/lib/validators'

export default {
  name: 'new-event-dialog',

  created () {
    this.loadAgencies()
  },

  data () {
    return {
      form: {
        name: null,
        description: null,
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
      description: {
        required,
        maxLength: maxLength(200),
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
      this.form.description = null
      this.form.agencies = []
    },

    submitForm () {
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
        // close form
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
    md-dialog-content
      // Event name
      md-field(:class="getValidationClass('name')")
        label(for="event-name") Event name
        md-input(
        name="event-name"
        v-model="form.name"
        )
        span.md-error(v-if="!$v.form.name.required") An event must have a name.
        span.md-error(v-else-if="!$v.form.name.minLength") Must be at least 3 letters long.

      // Event description
      md-field(:class="getValidationClass('description')")
        label(for="description") Description
        md-textarea(
        name="description"
        v-model="form.description"
        md-counter="200"
        )
        span.md-error(v-if="!$v.form.description.required") An event must have a description.
        span.md-error(v-else-if="!$v.form.description.maxLength") Cannot be longer than 200 characters.

      // Associated agencies
      md-field(:class="getValidationClass('agencies')")
        label(for="agencies") Assigned agencies
        md-select(
        v-model="form.agencies"
        name="agencies"
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
      md-button.md-secondary(@click="isNewEventDialogOpen = false") Cancel
      md-button.md-primary(@click="submitForm") Create
</template>
