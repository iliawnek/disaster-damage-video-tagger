import Firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyBxeua6P2GlAONRY2rGAqQK8zWbDuE-Pl8',
  authDomain: 'disaster-damage-video-tagger.firebaseapp.com',
  databaseURL: 'https://disaster-damage-video-tagger.firebaseio.com',
  projectId: 'disaster-damage-video-tagger',
  storageBucket: 'disaster-damage-video-tagger.appspot.com',
  messagingSenderId: '737684330599',
}

const app = Firebase.initializeApp(config)

export const db = Firebase.database()
export const auth = Firebase.auth()
