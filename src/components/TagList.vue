<script>
import {tagForm} from '@/values/tagValues'
import TagForm from '@/components/TagForm'
import {capitalise} from '@/utilities'

export default {
  name: 'tag-list',

  components: {
    TagForm,
  },

  props: [
    'tags',
  ],

  data () {
    return {
      filter: tagForm({}),
      isFilterDialogOpen: false,
    }
  },

  computed: {
    doTagsExist () {
      return this.tags && this.tags.length > 0
    },
    filteredTags () {
      return this.tags && this.filter && this.tags.filter((tag) => {
        if (this.filter.type) {
          const doesTagMatchType = tag.details.type === this.filter.type
          if (doesTagMatchType) {
            // tag must match selected type
            let filter = doesTagMatchType
            // tag sub-type values must match each selected (non-null) filter value
            Object.entries(this.filter[this.filter.type]).forEach(([subType, value]) => {
              if (value) filter = filter && tag.details[subType] === value
            })
            return filter
          } else {
            return false // tag doesn't match selected type
          }
        } else {
          return true // no type, therefore no filter
        }
      })
    },
    totalCount () {
      return this.tags ? this.tags.length : 0
    },
    filteredCount () {
      return this.filteredTags ? this.filteredTags.length : 0
    },
    tagCountText () {
      return `Showing ${this.filteredCount} of ${this.totalCount} ${this.totalCount === 1 ? 'tag' : 'tags'}`
    },
    tagListHelpText () {
      return this.filter.type
        ? 'List is filtered. Remove filter to show all tags.'
        : 'Filter by type for more detailed information.'
    },
  },

  methods: {
    clearForm () {
      this.filter.type = null
      this.filter.people.amount = null
      this.filter.people.state = null
      this.filter.people.freedom = null
      this.filter.water.form = null
      this.filter.vehicle.state = null
      this.filter.area.form = null
      this.filter.area.shelter = null
      this.filter.area.service = null
      this.filter.damage.form = null
      this.filter.description = null
    },

    capitalise (string) {
      return capitalise(string)
    },
  },
}
</script>

<template lang="pug">
  .tag-list
    .tag-list-header
      div
        .tag-list-title {{tagCountText}}
        .tag-list-subtitle {{tagListHelpText}}
      md-button.md-accent.md-raised(@click="isFilterDialogOpen = true") Filter

    md-dialog(
    :md-active.sync="isFilterDialogOpen"
    )
      md-dialog-title Filter tags
      tag-form(
      :form.sync="filter"
      :clearable="true"
      )
      md-dialog-actions
        md-button(@click="clearForm") Clear all
        md-button.md-primary(@click="isFilterDialogOpen = false") Done

    md-table(v-if="doTagsExist" md-card)
      md-table-row
        md-table-head Play video
        md-table-head Image
        md-table-head Type
        template(v-if="filter.type")
          md-table-head(
          v-for="subType in Object.keys(filter[filter.type])"
          :key="subType"
          ) {{capitalise(subType)}}
        md-table-head Description
      md-table-row(v-for="tag in filteredTags" :key="tag['.key']")
        md-table-cell
          md-button.md-icon-button.md-raised.md-accent
            md-icon play_arrow
        md-table-cell
          img.thumbnail(:src="tag.crop.images.highlighted")
        md-table-cell {{tag.details.type}}
        template(v-if="filter.type")
          md-table-cell(
          v-for="subType in Object.keys(filter[filter.type])"
          :key="subType"
          ) {{tag.details[subType]}}
        md-table-cell {{tag.details.description}}
</template>

<style scoped lang="sass">
  .tag-list-header
    display: flex
    align-items: center
    justify-content: space-between
    margin: 16px
  .tag-list-title
    font-size: 1.2em
    font-weight: bold
  .tag-list-subtitle
    font-size: 0.9em
  .thumbnail
    height: 50px
    object-fit: cover
</style>
