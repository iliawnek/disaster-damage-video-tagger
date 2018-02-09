<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Home',

  data () {
    return {
      tagline: 'Contribute to disaster relief from anywhere.',
      shortDescription: 'Help agencies manage emergencies by tagging videos of the event.',
      description: [
        `Thousands of videos are uploaded onto Twitter when a disaster strikes, showing the damage and destruction caused.
         Such videos contain information that is very valuable to the agencies that manage the aftermath of the event.`,
        'However, many agencies lack the resources and manpower required to extract this information.',
        `Disaster Damage Video Tagger aims to address this problem by allowing volunteers to submit and tag Twitter videos of the event.
         This enables agencies to access valuable information that could greatly assist their relief effort.`,
      ],
      steps: [
        'Browse videos of recent disaster events, or submit your own.',
        'Tag video frames that contain something of interest.',
        'Categorise and describe what you\'ve tagged.',
        'All submitted tags can be used by agencies to assist their relief effort.',
      ],
    }
  },

  computed: {
    ...mapGetters({
      isSignedIn: 'auth/isSignedIn',
    }),
  },

  methods: {
    ...mapActions({
      signInWithGoogle: 'auth/signInWithGoogle',
    }),
    getStarted () {
      if (this.isSignedIn) {
        this.$router.push({name: 'browse'})
      } else {
        this.signInWithGoogle()
      }
    },
  },
}
</script>

<template lang="pug">
  .home
    .section.md-dark
      .section-content
        .tagline {{tagline}}
        .short-description {{shortDescription}}
        div
          md-button.call-to-action.md-primary.md-raised(@click="getStarted") Get started

    .section.md-white
      .section-content
        .header How does it work?
        .step(v-for="(step, index) in steps")
          .step-circle.md-white.md-elevation-5(v-if="index < steps.length - 1")
            .step-number {{index + 1}}
          .step-circle.md-primary.md-elevation-5(v-else)
            .step-number
              i.material-icons done
          .step-text {{step}}

    .section.md-dark
      .section-content
        .header Why does this exist?
        .template(v-for="sentence in description")
          .text {{sentence}}

</template>

<style scoped lang="sass">
  @import '../styles/theme'
  $md-primary-dark: #1565C0

  .md-primary
    background-color: $md-primary
    color: white
  .md-primary-dark
    background-color: $md-primary-dark
    color: white
  .md-white
    color: black
  .md-dark
    background-color: $md-dark
    color: white

  .home
    display: flex
    flex-direction: column
    justify-content: center
    width: 100%
    text-align: center
  .section
    padding: 64px 32px
    display: flex
    justify-content: center
  .section-content
    max-width: 800px
    display: flex
    flex-direction: column
    justify-content: center

  .tagline
    margin-top: 32px
    font-size: 40px
    line-height: 1em
    font-weight: bold
  .short-description
    margin-top: 16px
    font-size: 20px
    line-height: 1.5em
  .call-to-action
    margin-top: 64px
    font-size: 16px
    height: 50px
    width: 150px

  .header
    margin-bottom: 32px
    font-size: 28px
    line-height: 1em
    font-weight: bold
  .text
    max-width: 500px
    text-align: left
    font-size: 18px
    line-height: 1.5em
    margin: 16px 0

  .step
    display: flex
    align-items: center
    margin: 16px 0

  .step-circle
    display: flex
    justify-content: center
    align-items: center
    width: 50px
    height: 50px
    border-radius: 100%
    margin-right: 16px
  .step-number
    font-size: 20px
    line-height: 20px
    font-weight: bold
  .step-text
    font-size: 18px
</style>
