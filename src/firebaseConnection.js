import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCAGsCjjd2dpnhQSEXF1c5abJg39Ym0lyQ",
  authDomain: "react-loginlist.firebaseapp.com",
  projectId: "react-loginlist",
  storageBucket: "react-loginlist.appspot.com",
  messagingSenderId: "541192124636",
  appId: "1:541192124636:web:c86505438e02cf62479c19",
  measurementId: "G-TGE4BG27PF"
};
 
const firebaseApp = initializeApp(firebaseConfig);

const dataBase = getFirestore(firebaseApp); 
const auth = getAuth(firebaseApp);

export { dataBase, auth }