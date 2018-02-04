<script>
import {tagForm} from '@/values/tagValues'
import TagForm from '@/components/TagForm'
import {capitalise} from '@/utilities'
import Lightbox from 'vue-image-lightbox'

export default {
  name: 'tag-list',

  components: {
    TagForm,
    Lightbox,
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
    filteredTagImages () {
      return this.filteredTags && this.filteredTags.map((tag) => {
        return {
          src: tag.crop.images.highlighted,
          thumb: tag.crop.images.highlighted,
          caption: `Tag #${tag.number}`,
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

    showImage (index) {
      this.$refs.lightbox.showImage(index)
    },
  },
}
</script>

<template lang="pug">
  .tag-list-container(v-if="doTagsExist")
    .tag-list-content
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

      md-table.tag-list-table(md-card)
        // header row
        md-table-row
          md-table-head
          md-table-head #
          md-table-head Image
          md-table-head Type
          template(v-if="filter.type")
            md-table-head(
            v-for="subType in Object.keys(filter[filter.type])"
            :key="subType"
            ) {{capitalise(subType)}}
          md-table-head Description

        // tag rows
        md-table-row(v-for="(tag, index) in filteredTags" :key="tag['.key']")
          md-table-cell
            md-button.md-icon-button.md-raised.md-accent.md-dense
              md-icon play_arrow
          md-table-cell {{`#${tag.number}`}}
          md-table-cell
            img.thumbnail(:src="tag.crop.images.highlighted" @click="showImage(index)")
          md-table-cell {{tag.details.type}}
          template(v-if="filter.type")
            md-table-cell(
            v-for="subType in Object.keys(filter[filter.type])"
            :key="subType"
            ) {{tag.details[subType]}}
          md-table-cell {{tag.details.description || '—'}}

      lightbox(
      v-if="filteredTagImages"
      :images="filteredTagImages"
      :showLightBox="false"
      :showCaption="true"
      ref="lightbox"
      )
</template>

<style scoped lang="sass">
  .tag-list-container
    display: flex
    justify-content: center
  .tag-list-content
    max-width: 1200px
    margin: 32px
  .tag-list-header
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 16px
  .tag-list-title
    font-size: 1.2em
    font-weight: bold
  .tag-list-subtitle
    font-size: 0.9em
  .thumbnail
    height: 40px
    width: 40px
    margin: 4px
    object-fit: cover
    cursor: pointer
  .md-button // fix button showing above lightbox
    z-index: 0
</style>
