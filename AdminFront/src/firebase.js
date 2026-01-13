// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBagglV-SuRFcZMLADPcKecNmd2NL0Zuro",
//   authDomain: "fluteon-35cf4.firebaseapp.com",
//   projectId: "fluteon-35cf4",
//   storageBucket: "fluteon-35cf4.appspot.com",
//   messagingSenderId: "your-messagingSenderId",
//   appId: "your-app-id",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwN3iL5XVslbBD3CEe7aKxSvtwZmIMZT4",
  authDomain: "fluteon-35cf4-9d993.firebaseapp.com",
  projectId: "fluteon-35cf4-9d993",
  storageBucket: "fluteon-35cf4-9d993.firebasestorage.app",
  messagingSenderId: "587923428114",
  appId: "1:587923428114:web:b9785903d69f06eea899cb",
  measurementId: "G-DW8P5KNX7Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
