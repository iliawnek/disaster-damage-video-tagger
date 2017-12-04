import urlParse from 'url-parse'

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

export function isYouTubeUrl (url) {
  const {hostname} = urlParse(url)
  return [
    'www.youtube.com',
    'youtu.be',
  ].includes(hostname)
}

export function extractYouTubeVideoId (url) {
  const {hostname, pathname, query} = urlParse(url, true)
  let videoId
  if (hostname === 'www.youtube.com' && pathname === '/watch') {
    videoId = query.v
  } else if (hostname === 'youtu.be') {
    videoId = pathname.substring(1)
  }
  return videoId && (videoId.length === 11 ? videoId : undefined)
}
