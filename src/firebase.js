
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD-6MIjcduFEKj3mtD54qzvvQKItA0_T9g",
  authDomain: "my-activity-af72c.firebaseapp.com",
  databaseURL: "https://my-activity-af72c.firebaseio.com",
  projectId: "my-activity-af72c",
  storageBucket: "my-activity-af72c.appspot.com",
  messagingSenderId: "1074153188080",
  appId: "1:1074153188080:web:c25d9697434229b3aab035"
};

// Initialize Firebase
const fireBaseApp = firebase.initializeApp(firebaseConfig);

const db = fireBaseApp.firestore();


export default db;