import logo from './logo.svg';
import './App.css';

import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDPJBnRSj8iuDh9kqgNk20nu2AJ6RgOmro",
  authDomain: "chat-c84a6.firebaseapp.com",
  projectId: "chat-c84a6",
  storageBucket: "chat-c84a6.appspot.com",
  messagingSenderId: "933924540988",
  appId: "1:933924540988:web:bbfbdd0e44f4317c16e939"
})

const auth = firebase.auth()
const firestore = firebase.firestore()


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button ></button>
      </header>
    </div>
  );
}

export default App;
