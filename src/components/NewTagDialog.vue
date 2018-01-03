<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'

export default {
  name: 'new-tag-dialog',

  data () {
    return {
      form: {
        type: null,
        people: {
          amount: null,
          state: null,
          freedom: null,
        },
        water: {
          form: null,
        },
        vehicle: {
          state: null,
        },
        area: {
          form: null,
          shelter: null,
          service: null,
        },
        damage: {
          form: null,
        },
        description: null,
      },
      types: [
        'people',
        'water',
        'vehicle',
        'area',
        'damage',
        'other',
      ],
      people: {
        amount: [
          'one person',
          'more than one person',
        ],
        state: [
          'all healthy',
          'some injured',
          'some dead',
          'mixed',
        ],
        freedom: [
          'walking',
          'unable to walk',
          'trapped',
        ],
      },
      water: {
        form: [
          'flood',
          'natural environment',
          'distributed safely',
        ],
      },
      vehicle: {
        state: [
          'working',
          'broken',
          'unsure',
        ],
      },
      area: {
        form: [
          'provided by relief effort',
          'makeshift',
        ],
        shelter: [
          'sheltered',
          'not sheltered',
        ],
        service: [
          'food',
          'water',
          'medical aid',
          'human remains management',
          'other supplies',
        ],
      },
      damage: {
        form: [
          'fire',
          'collapsed structure',
          'unstable structure',
          'road blockage',
          'compromised bridge',
          'damaged power or communication line',
          'landslide',
        ],
      },
    }
  },

  validations () {
    const validations = {
      form: {
        type: {required},
      },
    }
    if (this.form.type === 'people') {
      validations.form.people = {
        amount: {required},
        state: {required},
        freedom: {required},
      }
    } else if (this.form.type === 'water') {
      validations.form.water = {
        form: {required},
      }
    } else if (this.form.type === 'vehicle') {
      validations.form.vehicle = {
        state: {required},
      }
    } else if (this.form.type === 'area') {
      validations.form.area = {
        form: {required},
        shelter: {required},
        service: {required},
      }
    } else if (this.form.type === 'damage') {
      validations.form.damage = {
        form: {required},
      }
    } else if (this.form.type === 'other') {
      validations.form.description = {required}
    }
    return validations
  },

  computed: {
    ...mapState({
      images: (state) => state.tagger.crop && state.tagger.crop.images,
      uploading: (state) => state.tagger.uploading,
    }),
    ...mapGetters({
      currentStageName: 'tagger/currentStageName',
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
      previousStage: 'tagger/previousStage',
      nextStage: 'tagger/nextStage',
    }),

    ...mapActions({
      saveNewTag: 'tagger/saveNewTag',
    }),

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
        this.saveNewTag(formToSave)
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

        div(v-if="form.type === 'people'")
          md-field(:class="getValidationClass('people', 'amount')")
            label(for="people-amount") Amount
            md-select(
            v-model="form.people.amount"
            name="people-amount"
            md-dense
            )
              md-option(
              v-for="option in people.amount"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.people && !$v.form.people.amount.required") Required.
          md-field(:class="getValidationClass('people', 'state')")
            label(for="people-state") State
            md-select(
            v-model="form.people.state"
            name="people-state"
            md-dense
            )
              md-option(
              v-for="option in people.state"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.people && !$v.form.people.state.required") Required.
          md-field(:class="getValidationClass('people', 'freedom')")
            label(for="people-freedom") Freedom
            md-select(
            v-model="form.people.freedom"
            name="people-freedom"
            md-dense
            )
              md-option(
              v-for="option in people.freedom"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.people && !$v.form.people.freedom.required") Required.

        div(v-if="form.type === 'water'")
          md-field(:class="getValidationClass('water', 'form')")
            label(for="water-form") Form
            md-select(
            v-model="form.water.form"
            name="water-form"
            md-dense
            )
              md-option(
              v-for="option in water.form"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.water && !$v.form.water.form.required") Required.

        div(v-if="form.type === 'vehicle'")
          md-field(:class="getValidationClass('vehicle', 'state')")
            label(for="vehicle-state") State
            md-select(
            v-model="form.vehicle.state"
            name="vehicle-state"
            md-dense
            )
              md-option(
              v-for="option in vehicle.state"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.vehicle && !$v.form.vehicle.state.required") Required.

        div(v-if="form.type === 'area'")
          md-field(:class="getValidationClass('area', 'form')")
            label(for="area-form") Form
            md-select(
            v-model="form.area.form"
            name="area-form"
            md-dense
            )
              md-option(
              v-for="option in area.form"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.area && !$v.form.area.form.required") Required.
          md-field(:class="getValidationClass('area', 'shelter')")
            label(for="area-shelter") Shelter
            md-select(
            v-model="form.area.shelter"
            name="area-shelter"
            md-dense
            )
              md-option(
              v-for="option in area.shelter"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.area && !$v.form.area.shelter.required") Required.
          md-field(:class="getValidationClass('area', 'service')")
            label(for="area-service") Service
            md-select(
            v-model="form.area.service"
            name="area-service"
            md-dense
            )
              md-option(
              v-for="option in area.service"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.area && !$v.form.area.service.required") Required.

        div(v-if="form.type === 'damage'")
          md-field(:class="getValidationClass('damage', 'form')")
            label(for="damage-form") Form
            md-select(
            v-model="form.damage.form"
            name="damage-form"
            md-dense
            )
              md-option(
              v-for="option in damage.form"
              :key="option"
              :value="option"
              ) {{option}}
            span.md-error(v-if="$v.form.damage && !$v.form.damage.form.required") Required.

        md-field(:class="getValidationClass('description')")
          label(for="description") Description
          md-textarea(
          v-model="form.description"
          name="description"
          md-autogrow
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
