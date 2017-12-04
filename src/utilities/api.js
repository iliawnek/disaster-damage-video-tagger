import axios from 'axios'

export const youTube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: process.env.YOUTUBE_API_KEY,
  },
})
