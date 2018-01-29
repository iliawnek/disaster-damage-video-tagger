<script>
import {tagTypeNames, tagTypeValues} from '@/values/tagValues'

export default {
  name: 'tag-form',

  props: [
    'form',
    'showDescription',
    'clearable',
    '$v',
  ],

  data () {
    return {
      localForm: this.form,
      types: tagTypeNames,
      values: tagTypeValues,
    }
  },

  created () {
    this.$emit('update:form', this.localForm)
    console.log('created!')
  },

  methods: {
    getValidationClass (fieldName, subFieldName) {
      if (this.$v) {
        const field = subFieldName ? this.$v.form[fieldName][subFieldName] : this.$v.form[fieldName]
        if (field) {
          return {
            'md-invalid': field.$error,
          }
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
    .clearable-field
      md-field(:class="getValidationClass('type')")
        label(for="type") Type
        md-select(
        v-model="localForm.type"
        :placeholder="clearable ? 'Any type' : ''"
        name="type"
        md-dense
        )
          md-option(
          v-for="type in types"
          :key="type"
          :value="type"
          ) {{type}}
        span.md-error(v-if="$v && !$v.form.type.required") Required.
      md-button(v-if="clearable && localForm.type" @click="localForm.type = null").md-icon-button
        md-icon close

    // sub-types
    div(
    v-for="(subTypes, type) in values"
    v-if="form.type === type"
    :key="type"
    )
      .clearable-field(v-for="(options, subType) in subTypes")
        md-field(
        :class="getValidationClass(type, subType)"
        :key="`${type}-${subType}`"
        )
          label(:for="`${type}-${subType}`") {{capitalise(subType)}}
          md-select(
          v-model="localForm[type][subType]"
          :placeholder="clearable ? `Any ${subType}` : ''"
          :name="`${type}-${subType}`"
          md-dense
          )
            md-option(
            v-for="option in options"
            :key="option"
            :value="option"
            ) {{option}}
          span.md-error(v-if="$v && !$v.form[type][subType].required") Required.
        md-button(v-if="clearable" @click="localForm[type][subType] = null").md-icon-button
          md-icon close

    // description
    md-field(v-if="showDescription" :class="getValidationClass('description')")
      label(for="description") Description
      md-textarea(
      v-model="localForm.description"
      name="description"
      )
      span.md-error(v-if="$v && $v.form.description && !$v.form.description.required") Required.
</template>

<style scoped lang="sass">
  .clearable-field
    display: flex
    align-items: center
</style>
