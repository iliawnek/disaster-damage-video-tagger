<script>
import {tagForm} from '@/values/tagValues'

export default {
  name: 'tag-form',

  props: [
    'form',
    'types',
    'values',
    '$v',
  ],

  data () {
    return {
      localForm: tagForm({includeDescription: true}),
    }
  },

  created () {
    this.$emit('update:form', this.localForm)
  },

  methods: {
    getValidationClass (fieldName, subFieldName) {
      const field = subFieldName ? this.$v.form[fieldName][subFieldName] : this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$error,
        }
      }
    },

    capitalise (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
  },
}
</script>

<template lang="pug">
  md-dialog-content
    // type
    md-field(:class="getValidationClass('type')")
      label(for="type") Type
      md-select(
      v-model="localForm.type"
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
        v-model="localForm[type][subType]"
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
      v-model="localForm.description"
      name="description"
      )
      span.md-error(v-if="$v.form.description && !$v.form.description.required") Required.
</template>

<style scoped lang="sass">

</style>
