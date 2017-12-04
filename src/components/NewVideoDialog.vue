<script>
import {mapGetters, mapActions} from 'vuex'
import {required, url} from 'vuelidate/lib/validators'
import {youTubeUrl, youTubeVideo} from '@/validators'
import {mapBoolean} from '@/utilities'
import Message from '@/components/Message'

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

  components: {
    message: Message,
  },

  validations: {
    form: {
      url: {
        required,
        url,
        youTubeUrl,
        youTubeVideo,
      },
      event: {
        required,
      },
    },
  },

  computed: {
    ...mapGetters({
      eventIdsByName: 'event/eventIdsByName',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewVideoDialogOpen',
      setTrue: 'openNewVideoDialog',
      setFalse: 'closeNewVideoDialog',
    }),
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
      this.$v.$reset()
      this.form.url = null
      this.form.event = null
    },

    validateVideo () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveNewVideo({
          video: this.form,
        })
        this.isNewVideoDialogOpen = false
      }
    },
  },
}
</script>

<template lang="pug">
  md-dialog(
  :md-active.sync="isNewVideoDialogOpen"
  @md-closed="clearForm"
  :md-close-on-esc="false"
  :md-click-outside-to-close="false"
  )
    md-dialog-title Submit video
    message(
    message="Only YouTube videos are currently supported."
    icon="warning"
    )
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
          span.md-error(v-else-if="!$v.form.url.url") Invalid URL.
          span.md-error(v-else-if="!$v.form.url.youTubeUrl") Only YouTube videos are currently supported.
          span.md-error(v-else-if="!$v.form.url.youTubeVideo") Invalid YouTube video.

        md-field(:class="getValidationClass('event')")
          label(for="event") Event
          md-select(
          v-model="form.event"
          name="event"
          id="event"
          md-dense
          )
            md-option(
            v-for="(id, name) in eventIdsByName"
            :key="id"
            :value="id"
            ) {{name}}
          span.md-error(v-if="!$v.form.event.required") A video must be assigned to an event.

      md-dialog-actions
        md-button.md-secondary(type="submit" @click="isNewVideoDialogOpen = false") Cancel
        md-button.md-primary(type="submit") Submit
</template>
