import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyCpRh-B4EzDNweH4PQJ3jzDgvCi7R4dfZQ",
    authDomain: "kampretgram-react.firebaseapp.com",
    databaseURL: "https://kampretgram-react.firebaseio.com",
    projectId: "kampretgram-react",
    storageBucket: "kampretgram-react.appspot.com",
    messagingSenderId: "104691287829",
    appId: "1:104691287829:web:2306238d65ed431ce78b1c",
    measurementId: "G-1VXPG3GEEZ"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
