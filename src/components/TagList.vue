<script>
import TagCard from '@/components/TagCard'

export default {
  name: 'tag-list',

  components: {
    'tag-card': TagCard,
  },

  props: [
    'tags',
  ],
}
</script>

<template lang="pug">
  .tag-list(v-if="tags")
    // tags reversed to put newest on top
    tag-card(
    v-for="tag in [...tags].reverse()"
    :key="tag['.key']"
    :tag="tag"
    )

</template>

<style scoped lang="sass">
  .tag-list
</style>
