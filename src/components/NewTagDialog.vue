<script>
import {mapGetters, mapMutations} from 'vuex'
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
    ...mapGetters({
      currentStageName: 'tagger/currentStageName',
    }),
    showDialog () {
      return this.currentStageName === 'dialog'
    },
  },

  methods: {
    ...mapMutations({
      previousStage: 'tagger/previousStage',
      nextStage: 'tagger/nextStage',
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
    },

    validateTag () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        // TODO: save tag
      }
    },
  },
}
</script>

<template lang="pug">
  div
    md-dialog(
    :md-active.sync="showDialog"
    @md-closed="clearForm"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    )
      md-dialog-title Create new tag
      form(novalidate @submit.prevent="validateTag")
        md-dialog-content
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

        md-dialog-actions
          md-button.md-secondary(@click="previousStage") Back
          md-button.md-primary(type="submit") Done
</template>
