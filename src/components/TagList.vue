<script>
import {tagForm} from '@/values/tagValues'
import TagForm from '@/components/TagForm'
import {mapGetters} from 'vuex'
import {capitalise, mapGettersWithParams} from '@/utilities'
import Lightbox from 'vue-image-lightbox'
import {sortBy, findIndex} from 'lodash'

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
      visibleTags: this.tags,
      filter: tagForm({}),
      sortBy: '#',
      sortOrder: 'asc',
      isFilterDialogOpen: false,
      isTagPlaybackAlertOpen: false,
    }
  },

  computed: {
    ...mapGetters({
      currentStageName: 'tag/currentStageName',
    }),
    doTagsExist () {
      return this.tags && this.tags.length > 0
    },
    filteredTags () {
      // apply filter
      const filtered = this.tags && this.filter && this.tags.filter((tag) => {
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
      // apply sort
      const sorted = sortBy(filtered, (tag) => {
        if (this.sortBy === 'number') return tag.number
        if (this.sortBy === 'start') return tag.range.start
        if (this.sortBy === 'end') return tag.range.end
        return tag.details[this.sortBy]
      })
      // ascending or descending order
      return this.sortOrder === 'desc' ? sorted.reverse() : sorted
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
    areTagsPlayable () {
      return this.currentStageName === 'play'
    },
  },

  watch: {
    filteredTags (filteredTags) {
      this.visibleTags = filteredTags
    },
  },

  methods: {
    ...mapGettersWithParams({
      getLinkToVideo: 'video/getLinkToVideo',
    }),

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

    showImage (tagNumber) {
      const index = findIndex(this.filteredTags, (tag) => tag.number === tagNumber)
      this.$refs.lightbox.showImage(index)
    },

    formatDuration (totalSeconds) {
      const leadingZero = (value) => value < 10 ? `0${value}` : value
      const minutes = leadingZero(Math.round(totalSeconds / 60))
      const seconds = leadingZero(Math.round(totalSeconds % 60))
      return `${minutes}:${seconds}`
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

      // dummy function used for sort to bypass
      md-table.tag-list-table(
      v-model="visibleTags"
      :md-sort.sync="sortBy"
      :md-sort-order.sync="sortOrder"
      :md-sort-fn="(value) => value"
      md-card
      )
        md-table-row(slot="md-table-row" slot-scope="{item}")
          md-table-cell
            router-link(v-if="areTagsPlayable" :to="{path: getLinkToVideo(item.video), query: {tag: item.number}}")
              md-button.md-icon-button.md-raised.md-accent.md-dense
                md-icon play_arrow
            md-button.md-icon-button.md-raised.md-accent.md-dense(v-else @click="isTagPlaybackAlertOpen = true")
              md-icon play_arrow
          md-table-cell(md-label="#" md-sort-by="number") {{`#${item.number}`}}
          md-table-cell(md-label="Image")
            img.thumbnail(:src="item.crop.images.highlighted" @click="showImage(item.number)")
          md-table-cell(md-label="Start" md-sort-by="start") {{formatDuration(item.range.start)}}
          md-table-cell(md-label="End" md-sort-by="end") {{formatDuration(item.range.end)}}
          md-table-cell(md-label="Type" md-sort-by="type") {{item.details.type}}
          template(v-if="filter.type")
            md-table-cell(
            v-for="subType in Object.keys(filter[filter.type])"
            :md-label="capitalise(subType)"
            :md-sort-by="subType"
            :key="subType"
            ) {{item.details[subType]}}
          md-table-cell(md-label="Description" md-sort-by="description") {{item.details.description || '—'}}

      md-dialog-alert(
      :md-active.sync="isTagPlaybackAlertOpen"
      md-title="Cannot play tag"
      md-content="An existing tag cannot be played while creating a new tag. Finish creating the tag or cancel the process, then try again."
      md-confirm-text="Understood"
      )

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
