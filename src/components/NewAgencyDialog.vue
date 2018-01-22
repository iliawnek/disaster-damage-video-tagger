<script>
import {mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'
import {required, minLength, maxLength, url} from 'vuelidate/lib/validators'
import VueCropper from 'vue-cropperjs'

export default {
  name: 'new-agency-dialog',

  components: {
    VueCropper,
  },

  data () {
    return {
      form: {
        name: null,
        description: null,
        website: null,
      },
      image: null,
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
        maxLength: maxLength(800),
      },
      website: {
        url,
      },
    },
  },

  computed: {
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

    handleImageChange (event) {
      // get image data URL
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // save image data URL
        const dataURL = reader.result
        this.image = dataURL
        // update cropper if already initialised
        if (this.$refs.cropper) this.$refs.cropper.replace(dataURL)
      }
    },

    cropImage () {
      const {cropper} = this.$refs
      if (cropper) {
        const canvas = cropper.getCroppedCanvas({
          width: 500,
          height: 500,
        })
        return canvas.toDataURL()
      }
    },

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
      this.form.website = null
      this.image = null
    },

    submitForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveNewAgency({
          agency: this.form,
          logo: this.cropImage(),
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
    md-dialog-content
      md-field(:class="getValidationClass('name')")
        label(for="agency-name") Agency name
        md-input(
        name="agency-name"
        v-model="form.name"
        )
        span.md-error(v-if="!$v.form.name.required") An agency must have a name.
        span.md-error(v-else-if="!$v.form.name.minLength") Must be at least 3 letters long.

      md-field(:class="getValidationClass('description')")
        label(for="description") Description
        md-textarea(
        name="description"
        v-model="form.description"
        md-counter="800"
        )
        span.md-error(v-if="!$v.form.description.required") An agency must have a description.
        span.md-error(v-else-if="!$v.form.name.maxLength") Cannot be longer than 800 characters.

      md-field
        label(for="logo") Logo
        md-file(
        name="logo"
        @change="handleImageChange"
        accept="image/*"
        )

      .cropper
        vue-cropper(
        v-if="image"
        ref="cropper"
        :src="image"
        :view-mode="2"
        :aspect-ratio="1"
        :guides="false"
        :center="false"
        :auto-crop="true"
        :auto-crop-area="1"
        :zoomable="false"
        )

      md-field(:class="getValidationClass('website')")
        label(for="website") Website URL
        md-input(
        website="website"
        v-model="form.website"
        )
        span.md-error(v-if="!$v.form.website.url") Not a valid URL.

    md-dialog-actions
      md-button.md-secondary(@click="isNewAgencyDialogOpen = false") Cancel
      md-button.md-primary(@click="submitForm") Create
</template>

<style scoped lang="sass">
  .cropper
    margin-bottom: 16px
</style>
