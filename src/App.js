import logo from './logo.svg';
import './App.css';

import React, { useEffect, useRef, useState } from 'react';

import firebase from 'firebase/app';
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
    <div className="w-full h-screen overflow-hidden">
        <section className="text-gray-700 body-font">
            <div className="container flex flex-col items-center px-5 py-16 mx-auto md:flex-row lg:px-28">
                <div
                    className="flex flex-col items-start w-full pt-0 mb-16 text-left lg:flex-grow md:w-1/2 xl:mr-20 md:pr-24 md:mb-0 ">
                    <h1 className="mb-8 text-2xl font-black tracking-tighter text-black md:text-5xl title-font">
                        Make Fun With Together.
                    </h1>
                    <p className="mb-8 text-base leading-relaxed text-left text-blueGray-600 ">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                    <div className="flex flex-col w-full gap-2 md:justify-start md:flex-row"> 
                        <button onClick={signInWithGoogle}  className="flex items-center w-full px-6 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg lg:w-auto hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2">
                        <img src={"https://img.icons8.com/plasticine/2x/google-logo.png"} alt='Google Icon' className="w-12 h-12" />
                         <span>Sign In With Google</span>
                        </button>
                    </div>
                </div>
                <div className="w-full h-screen lg:w-5/6 lg:max-w-lg md:w-1/2">
                    <img className="object-cover object-center rounded-lg h-5/6" alt="hero"
                        src="https://images.unsplash.com/photo-1521898284481-a5ec348cb555?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" />
                </div>
            </div>
        </section>
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
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt', 'asc').limitToLast(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { displayName, uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      user: displayName,
      body: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photoURL: photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div>
        {/* call ChatMessage Component for each new message */}
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something" />
        <button type="submit" disabled={!formValue}>send</button>
      </form>
    </div>
  )
}

function ChatMessage(props) {
  const { user, body, uid, photoURL, createdAt } = props.message;

    return (
      <div>
        <div>
          <img src={photoURL || 'https://i.imgur.com/rFbS5ms.png'} alt="{user}'s pfp" />
        </div>
        <div>
          <p>{user}</p>
          <p>{body}</p>
        </div>
      </div>
  )
}

export default App;
