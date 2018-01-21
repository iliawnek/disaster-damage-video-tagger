<script>
import {mapGetters, mapActions} from 'vuex'
import {required, url} from 'vuelidate/lib/validators'
import {tweetUrl} from '@/validators'
import {mapBoolean} from '@/utilities'
import Message from '@/components/Message'
import {serverless} from '@/utilities/api'

export default {
  name: 'new-video-dialog',

  data () {
    return {
      form: {
        url: null,
        event: null,
      },
      tweetLoading: false,
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
        tweetUrl,
      },
      event: {
        required,
      },
    },
    tweet: {
      required,
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

  asyncComputed: {
    async tweet () {
      if (!this.$v.form.url.$invalid) {
        this.tweet = null
        const params = {tweetUrl: this.form.url}
        this.tweetLoading = true
        try {
          const response = await serverless.get('/tweetInfo', {params})
          console.log(response.data)
          const {url, width, height, thumbnail, title} = response.data
          this.tweetLoading = false
          return {
            video: {
              url,
              width,
              height,
              thumbnail,
            },
            title,
          }
        } catch (error) {
          this.tweetLoading = false
          return null
        }
      } else {
        this.tweetLoading = false
        return null
      }
    },
  },

  watch: {
    isNewVideoDialogOpen (newVal, oldVal) {
      // when new video dialog opens...
      if (!oldVal && newVal) {
        // if on event page...
        if (this.$route.params.eventId) {
          // pre-fill form with event
          const {eventId} = this.$route.params
          this.form.event = eventId
        }
      }
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
        if (fieldName === 'url') {
          return {
            'md-invalid': field.$error || this.$v.tweet.$error,
          }
        } else {
          return {
            'md-invalid': field.$error,
          }
        }
      }
    },

    clearForm () {
      this.$v.$reset()
      this.form.url = null
      this.form.event = null
      this.tweet = null
    },

    submitForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveNewVideo({
          video: {
            url: this.tweet.video.url,
            width: this.tweet.video.width,
            height: this.tweet.video.height,
            thumbnail: this.tweet.video.thumbnail,
            title: this.tweet.title,
            event: this.form.event,
          },
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
    message="Only Twitter videos are currently supported."
    icon="warning"
    )
    md-dialog-content

      md-field(:class="getValidationClass('url')")
        label(for="url") Tweet URL
        md-input(
        name="url"
        id="url"
        v-model="form.url"
        )
        span.md-error(v-if="!$v.form.url.required") A video must have a tweet URL.
        span.md-error(v-else-if="!$v.form.url.url") Invalid URL.
        span.md-error(v-else-if="!$v.form.url.tweetUrl") URL does not link to a tweet.
        span.md-error(v-else-if="!$v.tweet.required && !tweetLoading") Tweet does not contain a video.

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
      md-button.md-secondary(@click="isNewVideoDialogOpen = false") Cancel
      md-button.md-primary(@click="submitForm" :disabled="tweetLoading") Submit
</template>
