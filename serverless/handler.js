'use strict'
const youtubedl = require('youtube-dl')

module.exports.tweetInfo = (event, context, callback) => {
  const tweetUrl = event.queryStringParameters.tweetUrl
  youtubedl.exec(
    tweetUrl,
    [
      '-g',
      '-f',
      'best[protocol=m3u8]',
    ],
    (error, url) => {
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
        response.body = url.slice(0, -1) // remove newline
      }
      callback(null, response)
    }
  )
}
