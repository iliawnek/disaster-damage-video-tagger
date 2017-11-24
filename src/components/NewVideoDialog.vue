<script>
import {mapState, mapActions} from 'vuex'
import {required, url} from 'vuelidate/lib/validators'
import _ from 'lodash'
import {mapBoolean} from '@/utilities'

export default {
  name: 'new-video-dialog',

  data () {
    return {
      form: {
        url: null,
        event: null,
      },
    }
  },

  validations: {
    form: {
      url: {
        required,
        url,
      },
      event: {
        required,
      },
    },
  },

  computed: {
    ...mapState({
      events: state => state.event.events,
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewVideoDialogOpen',
      setTrue: 'openNewVideoDialog',
      setFalse: 'closeNewVideoDialog',
    }),
    autocompleteOptions () {
      return this.events.map(event => event.name)
    },
  },

  methods: {
    ...mapActions({
      saveNewVideo: 'video/saveNewVideo',
      loadEvents: 'event/loadEvents',
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
      this.$v.reset()
      this.form.url = null
    },

    validateVideo () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const eventObject = _.find(this.events, event => event.name === this.form.event)
        const eventId = eventObject['.key']
        this.saveNewVideo({
          video: {
            url: this.form.url,
            event: eventId,
          },
        })
        this.isNewVideoDialogOpen = false
      }
    },
  },
}
</script>

<template lang="pug">
  md-dialog(:md-active.sync="isNewVideoDialogOpen")
    md-dialog-title Submit video
    form(novalidate @submit.prevent="validateVideo")
      md-dialog-content
        md-field(:class="getValidationClass('url')")
          label(for="url") Video URL
          md-input(
          name="url"
          id="url"
          v-model="form.url"
          )
          span.md-error(v-if="!$v.form.url.required") A video must have a video URL.
          span.md-error(v-else-if="!$v.form.url.url") Not a valid URL.

        md-autocomplete(
        :class="getValidationClass('event')"
        md-input-placeholder="Enter an event name..."
        v-model="form.event"
        :md-options="autocompleteOptions"
        :md-open-on-focus="false"
        md-dense
        )
          label Event
          template(slot="md-autocomplete-item" slot-scope="{item, term}")
            md-highlight-text(:md-term="term") {{item}}
          span.md-error(v-if="!$v.form.event.required") A video must be related to an event.

      md-dialog-actions
        md-button.md-secondary(type="submit" @click="isNewVideoDialogOpen = false") Cancel
        md-button.md-primary(type="submit") Submit
</template>

<style lang="sass">
  // required because md-autocomplete suggestion menu doesn't render properly within dialogs
  .md-menu-content
    z-index: 100000 !important
</style>
