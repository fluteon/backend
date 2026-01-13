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
  apiKey: "AIzaSyBagglV-SuRFcZMLADPcKecNmd2NL0Zuro",
  authDomain: "fluteon-35cf4.firebaseapp.com",
  projectId: "fluteon-35cf4",
  storageBucket: "fluteon-35cf4.appspot.com",
  messagingSenderId: "your-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
