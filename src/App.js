import logo from './logo.svg';
import './App.css';

import React, { useEffect, useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'

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
  const [user] = useAuthState(auth)

  return (
    <div>
      <SignOut />
      <section>
        {/* show Chat Room if user logged or else Sign In */}
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
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}

function ChatRoom() {
  // scroll to bottom when pre-load and after send message
  const dummy = useRef();
  const scrollToBottom = () => {
    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  // getting message
  const messageRef = firestore.collection('messages')
  // sorting them by time of creation
  const query = messageRef.orderBy('createdAt', 'asc').limitToLast(25)

  const [messages] = useCollectionData(query, {idField: 'id'})

  return (
    <div>
      <div>
        {/* return a ChatMessage component for each message :D */}
        { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>) }
        <span ref={dummy}></span>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(c) => setFormValue(c.target.value)} placeholder={"Write something..."} />
        <button type="submit" disabled={!formValue}>Send</button>
      </form>
    </div>
  )
}

export default App;
