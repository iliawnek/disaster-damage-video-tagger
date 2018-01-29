<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

import {tagTypeNames, tagTypeValues, tagForm, tagValidations} from '@/values/tagValues'

export default {
  name: 'new-tag-dialog',

  created () {
    console.log(tagForm({includeDescription: true}))
  },

  data () {
    return {
      form: tagForm({includeDescription: true}),
      types: tagTypeNames,
      values: tagTypeValues,
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

    capitalise (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },

    getValidationClass (fieldName, subFieldName) {
      const field = subFieldName ? this.$v.form[fieldName][subFieldName] : this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$error,
        }
      }
    },

    clearForm () {
      this.$v.$reset()
      this.form = tagForm({includeDescription: true})
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
      md-dialog-content(v-if="isCurrentStageDialog")
        // type
        md-field(:class="getValidationClass('type')")
          label(for="type") Type
          md-select(
          v-model="form.type"
          name="type"
          md-dense
          )
            md-option(
            v-for="type in types"
            :key="type"
            :value="type"
            ) {{type}}
          span.md-error(v-if="$v.form.type && !$v.form.type.required") Required.

        // sub-types
        div(
        v-for="(subTypes, type) in values"
        v-if="form.type === type"
        :key="type"
        )
          md-field(
          v-for="(options, subType) in subTypes"
          :class="getValidationClass(type, subType)"
          :key="`${type}-${subType}`"
          )
            label(:for="`${type}-${subType}`") {{capitalise(subType)}}
            md-select(
            v-model="form[type][subType]"
            :name="`${type}-${subType}`"
            md-dense
            )
              md-option(
              v-for="option in options"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form[type] && $v.form[type][subType].required") Required.

        // description
        md-field(:class="getValidationClass('description')")
          label(for="description") Description
          md-textarea(
          v-model="form.description"
          name="description"
          )
          span.md-error(v-if="$v.form.description && !$v.form.description.required") Required.

      md-dialog-actions(v-if="isCurrentStageDialog")
        md-button.md-secondary(@click="previousStage") Back
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
