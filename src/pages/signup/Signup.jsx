import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase/firebase';
import { Link ,useNavigate} from 'react-router-dom';
import "./Signup.css"

const Signup = ({setIsLoggedIn,uid,setUid,seturEmail}) => {

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const nav = useNavigate();


  const signUpUser = (e) => {
    e.preventDefault()

    const auth =  getAuth();
    
    const addUser = async (email, name, password) => {
      try {
        const userRef = db.collection('users').doc();
        const userDetails = {
          email: email,
          name: name,
          password: password,
          cartItems:[],
          orderedItems:[]
        };

        await userRef.set(userDetails);
        console.log('User added to Firestore successfully!');
      } catch (error) {
        console.error('Error adding user to Firestore:', error);
      }
    };


    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        
        addUser(email,username,password)
        seturEmail(email)
        setUid(userCredential.user.uid)
        localStorage.setItem("email",email)
        localStorage.setItem("uid",userCredential.user.uid)
        setIsLoggedIn(true)
        nav("/")

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
      });

  }

  return (
    <div className='form-container'>
      <h1>sign up page</h1>
      <form onSubmit={signUpUser}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor='email'>email</label>
        <input type='email' id='email' onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor='password'>password</label>
        <input type='password' id='password' onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Sign up</button>

        <Link to='/login'>login</Link>
      </form>
    </div>
  )
}

export default Signup