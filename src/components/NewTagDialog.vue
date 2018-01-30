<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {tagForm, tagValidations} from '@/values/tagValues'
import TagForm from '@/components/TagForm'

export default {
  name: 'new-tag-dialog',

  components: {
    TagForm,
  },

  data () {
    return {
      form: tagForm({includeDescription: true}),
    }
  },

  validations () {
    return tagValidations({
      selectedType: this.form.type,
    })
  },

  computed: {
    ...mapState({
      images: (state) => state.tag.crop && state.tag.crop.images,
      uploading: (state) => state.tag.uploading,
    }),
    ...mapGetters({
      currentStageName: 'tag/currentStageName',
    }),
    isCurrentStageDialog () {
      return this.currentStageName === 'dialog'
    },
    isCurrentStageDone () {
      return this.currentStageName === 'done'
    },
    shouldDialogBeOpen () {
      return this.isCurrentStageDialog || this.isCurrentStageDone
    },
    getDialogTitle () {
      if (this.isCurrentStageDialog) return 'Create new tag'
      if (this.isCurrentStageDone) return 'Tag created'
    },
  },

  watch: {
    uploading (newUploading, oldUploading) {
      if (oldUploading && !newUploading) {
        this.nextStage()
      }
    },
  },

  methods: {
    ...mapMutations({
      previousStage: 'tag/previousStage',
      nextStage: 'tag/nextStage',
    }),

    ...mapActions({
      saveNewTag: 'tag/saveNewTag',
    }),

    clearForm () {
      this.$v.$reset()
      this.form.type = null
      this.form.people.amount = null
      this.form.people.state = null
      this.form.people.freedom = null
      this.form.water.form = null
      this.form.vehicle.state = null
      this.form.area.form = null
      this.form.area.shelter = null
      this.form.area.service = null
      this.form.damage.form = null
      this.form.description = null
    },

    submitForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const {type, description} = this.form
        const formToSave = {
          type,
          ...this.form[type],
        }
        if (description) {
          formToSave.description = description
        }
        this.saveNewTag({
          details: formToSave,
          videoId: this.$route.params.videoId,
        })
      }
    },
  },
}
</script>

<template lang="pug">
  div
    md-dialog(
    :md-active.sync="shouldDialogBeOpen"
    @md-closed="clearForm"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    )
      .overlay-progress(v-if="uploading")
        md-progress-spinner(md-mode="indeterminate")
      md-dialog-title {{getDialogTitle}}
      img.crop-image(v-if="images" :src="images.cropped")

      tag-form(
      v-if="isCurrentStageDialog"
      :form.sync="form"
      :$v="$v"
      :showDescription="true"
      )

      md-dialog-actions(v-if="isCurrentStageDialog")
        md-button(@click="previousStage") Back
        md-button.md-primary(@click="submitForm") Create

      div(v-if="isCurrentStageDone")
        md-dialog-content This tag has been successfully created!
        md-dialog-actions
          md-button.md-primary(@click="nextStage") Done

</template>

<style scoped lang="sass">
  .overlay-progress
    position: absolute
    left: 0
    right: 0
    width: 100%
    height: 100%
    background-color: rgba(255,255,255,0.8)
    z-index: 5 // just enough overlay all dialog UI elements
    display: flex
    justify-content: center
    align-items: center
  .crop-image
    object-fit: contain
    background-color: black
    margin-bottom: 16px
    max-height: 20vh
</style>
