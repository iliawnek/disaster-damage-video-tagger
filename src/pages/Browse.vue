<script>
export default {
  name: 'Browse',
}
</script>

<template lang="pug">
  div
    p: b {{this.$options.name}} events
    p: router-link(to="nepal-army/gorkha-earthquake") Gorkha Earthquake
    p: b {{this.$options.name}} videos
    p: router-link(to="nepal-army/gorkha-earthquake/519") Uncut Drone footage earthquake Kathmandu Bhaktapur Nepal

</template>

<style scoped lang="sass">

</style>
