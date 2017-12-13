import axios from 'axios'

export const youTube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: process.env.YOUTUBE_API_KEY,
  },
})

export const serverless = axios.create({
  baseURL: 'https://1oylt7v3hj.execute-api.eu-west-1.amazonaws.com/dev',
})
