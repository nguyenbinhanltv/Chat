import logo from './logo.svg';
import './App.css';

import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

// firebase config
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

  // check user authenticate
  const [user] = userAuthState(auth)

  return (
    <div>
      <SignOut />
      <section>
        // show Chat Room if user logged or else Sign In
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={signInWithGoogle}>Login with Google</button>
      </header>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <div>
      <button onClick={() => auth.SignOut()}>Sign Out</button>
    </div>
  )
}

export default App;
