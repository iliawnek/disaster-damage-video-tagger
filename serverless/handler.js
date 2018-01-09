'use strict'
const youtubedl = require('youtube-dl')

module.exports.tweetInfo = (event, context, callback) => {
  const tweetUrl = event.queryStringParameters.tweetUrl
  youtubedl.getInfo(
    tweetUrl,
    [
      '-f',
      'best[protocol=m3u8]',
    ],
    (error, info) => {
      const response = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      }
      if (error) {
        response.statusCode = 404
      }
      else {
        response.statusCode = 200
        response.body = JSON.stringify(info)
      }
      callback(null, response)
    }
  )
}
