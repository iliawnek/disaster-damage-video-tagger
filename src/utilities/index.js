export function mapBoolean ({namespace, key, setTrue, setFalse}) {
  return {
    [key]: {
      get () {
        return this.$store.state[namespace][key]
      },
      set (value) {
        if (value) this.$store.commit(`${namespace}/${setTrue}`)
        else this.$store.commit(`${namespace}/${setFalse}`)
      },
    },
  }
}
