<script>
import {tagForm} from '@/values/tagValues'
import TagForm from '@/components/TagForm'

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
      filter: tagForm({includeDescription: true}),
      isFilterDialogOpen: false,
    }
  },

  computed: {
    doTagsExist () {
      return this.tags && this.tags.length > 0
    },
    filteredTags () {
      return this.tags && this.tags.filter((tag) => {
        const typeFilter = this.filter.type ? tag.details.type === this.filter.type : true
        return typeFilter
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
  },
}
</script>

<template lang="pug">
  .tag-list
    .tag-list-header
      .tag-list-title {{tagCountText}}
      md-button.md-raised(@click="isFilterDialogOpen = true") Filter

    md-dialog(
    :md-active.sync="isFilterDialogOpen"
    )
      md-dialog-title Filter tags
      tag-form(
      :form.sync="filter"
      :clearable="true"
      )
      md-dialog-actions
        md-button Clear all
        md-button.md-primary(@click="isFilterDialogOpen = false") Done

    md-table(v-if="doTagsExist" md-card)
      md-table-row
        md-table-head
        md-table-head Image
        md-table-head Type
        md-table-head Description
      md-table-row(v-for="tag in filteredTags" :key="tag['.key']")
        md-table-cell
          md-button.md-icon-button.md-raised.md-accent
            md-icon play_arrow
        md-table-cell
          img.thumbnail(:src="tag.crop.images.highlighted")
        md-table-cell {{tag.details.type}}
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
  .thumbnail
    height: 50px
    object-fit: cover
</style>
