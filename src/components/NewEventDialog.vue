<script>
import Vue from 'vue'
import {mapState, mapActions} from 'vuex'
import _ from 'lodash'
import {mapBoolean} from '@/utilities'
import {required, minLength} from 'vuelidate/lib/validators'
// import {required} from '@/utilities/validators'

export default {
  name: 'new-event-dialog',

  created () {
    this.loadAgencies()
  },

  data () {
    return {
      form: {
        name: null,
        agency: null,
        agencies: {},
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
      agencies: state => state.agency.agencies,
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewEventDialogOpen',
      setTrue: 'openNewEventDialog',
      setFalse: 'closeNewEventDialog',
    }),
    autocompleteOptions () {
      return this.agencies
        .map(agency => agency.name)
        .filter(agencyName => !Object.keys(this.form.agencies).includes(agencyName))
    },
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

    handleAgencySelection (agencyName) {
      // if not already selected...
      if (!this.form.agencies[agencyName]) {
        // get full agency object from store
        const agency = _.find(this.agencies, agency => agency.name === agencyName)
        // add object to data
        this.form.agencies[agencyName] = agency['.key']
      }
    },

    handleAgencyRemoval (name) {
      Vue.delete(this.form.agencies, name)
    },

    clearForm () {
      this.$v.$reset()
      this.form.name = null
      this.form.agency = null
      this.form.agencies = {}
    },

    validateEvent () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        // transform this.form.agencies into index
        const agencies = {}
        Object.values(this.form.agencies).forEach(agencyId => {
          agencies[agencyId] = true
        })
        // save event
        this.saveNewEvent({
          event: {
            name: this.form.name,
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
        md-autocomplete(
        md-input-placeholder="Enter an agency name..."
        v-model="form.agency"
        :md-options="autocompleteOptions"
        :md-open-on-focus="false"
        md-dense
        @md-selected="handleAgencySelection"
        )
          label Assigned agencies
          template(slot="md-autocomplete-item" slot-scope="{item, term}")
            md-highlight-text(:md-term="term") {{item}}
        #chips
          md-chip.md-primary(
          v-for="name in Object.keys(this.form.agencies)"
          :key="name"
          md-deletable
          @md-delete="handleAgencyRemoval(name, $event)"
          ) {{name}}

      md-dialog-actions
        md-button.md-secondary(type="submit" @click="isNewEventDialogOpen = false") Cancel
        md-button.md-primary(type="submit") Create
</template>

<style lang="sass">
  // required because md-autocomplete suggestion menu doesn't render properly within dialogs
  .md-menu-content
    z-index: 100000 !important
</style>
