import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvn7NbBxWAr0e3a8ax8OnR2hl-oWkdrqo",
  authDomain: "codenestlivetv.firebaseapp.com",
  projectId: "codenestlivetv",
  storageBucket: "codenestlivetv.firebasestorage.app",
  messagingSenderId: "901575067596",
  appId: "1:901575067596:web:1e701635f579b8dff37f69"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
