<script>
export default {
  name: 'tweet-preview',

  props: [
    'tweet',
    'loading',
  ],
}
</script>

<template lang="pug">
  .tweet-card-container
    .tweet-card.md-elevation-5
      div(v-if="tweet")
        a.link(:href="tweet.webpage_url")
          .tweet-preview
            img.thumbnail(:src="tweet.thumbnail")
            .text-section
              .title {{tweet.title}}
              .handle @{{tweet.uploader_id}}
            .overlay
      .spinner-overlay
        md-progress-spinner(v-if="loading" md-mode="indeterminate")
</template>

<style scoped lang="sass">
  .tweet-card-container
    display: flex
    justify-content: center
  .link
    text-decoration: none !important
  .tweet-card
    position: relative
    border-radius: 4px
    width: 350px
    height: 120px
    margin-bottom: 16px
  .tweet-preview
    display: flex
    position: relative
    align-items: center
    cursor: pointer
  .thumbnail
    width: 120px
    height: 120px
    object-fit: cover
    border-top-left-radius: 4px
    border-bottom-left-radius: 4px
  .text-section
    padding: 16px
    font-weight: bold
  .title
    color: #222
    line-height: 1.3em
    max-height: 3.9em
    overflow: hidden
  .handle
    color: #666
    font-size: 0.8em
    margin-top: 0.5em

  .spinner-overlay
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center

  .overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0)
    transition: 0.2s ease-out
  .tweet-preview:hover
    .overlay
      background-color: rgba(0,0,0,0.15)

</style>
