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
                        Make Fun Together.
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
    <div className="text-gray-700 bg-white body-font"> 
      <div className="flex flex-col flex-wrap justify-between p-5 mx-auto border-b md:items-center md:flex-row">
      <h2 class="text-2xl font-semibold tracking-tighter transition duration-1000 ease-in-out transform text-blueGray-500 lg:text-md text-bold lg:mr-8">
        Chat App
      </h2>
      <button onClick={() => auth.signOut()}
            className="items-center px-8 py-2 font-semibold text-white transition duration-500 ease-in-out transform bg-black rounded-lg hover:bg-blueGray-900 focus:ring focus:outline-none">Sign Out
      </button>
      </div>
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
    <div className="w-1/2 h-4/5 mt-1 border  m-auto">
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div>
          {/* call ChatMessage Component for each new message */}
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
           <span ref={dummy}></span>
        </div>
      <div className="relative flex">
         <span className="absolute inset-y-0 flex items-center top-4 left-3">
            <button type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mt-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
               </svg>
            </button>
         </span>
         <form onSubmit={sendMessage} className="w-11/12 mt-6 ml-4 flex ">
            <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Write Something" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-200 rounded-full py-3 pl-12" />
            <button type="submit" disabled={!formValue} className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none ml-4">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
               </svg>
            </button>
        </form>
      </div>
    </div>
  </div>
  )
}

function ChatMessage(props) {
  const { user, body, uid, photoURL, createdAt } = props.message;

    return (
      <div className="flex items-end ml-4 ">
        <div >
          <img src={photoURL || 'https://i.imgur.com/rFbS5ms.png'} alt="{user}'s pfp" className="rounded-full w-8 h-8" />
        </div>
        <div className="flex flex-col mt-8 space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          {/* <p>{user}</p> */}
          <p className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">{body}</p>
        </div>
      </div>
  )
}

export default App;
