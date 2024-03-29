import {withParams} from 'vuelidate/lib'
import {
  // youTube,
} from '@/utilities/api'
import {
  // isYouTubeUrl,
  // extractYouTubeVideoId,
  isTweetUrl,
} from '@/utilities'

// export const youTubeUrl = withParams(
//   {type: 'youTubeUrl'},
//   (url) => {
//     return isYouTubeUrl(url)
//   }
// )

// export const youTubeVideo = withParams(
//   {type: 'youTubeVideo'},
//   async (url) => {
//     // extract YouTube video ID from URL
//     const videoId = extractYouTubeVideoId(url)
//
//     // check if video exists
//     if (!videoId) return false
//     const params = {
//       id: videoId,
//       part: 'id',
//     }
//     const {data} = await youTube.get('/videos', {params})
//     return data.items.length > 0
//   },
// )

export const tweetUrl = withParams(
  {type: 'tweetUrl'},
  (url) => {
    return isTweetUrl(url)
  }
)
