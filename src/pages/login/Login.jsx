import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link,Navigate,useNavigate } from 'react-router-dom';
import "./Login.css"

const Login =  ({setIsLoggedIn,uid,setUid,seturEmail}) => {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const nav = useNavigate();

  const signInUser = (e) => {
    e.preventDefault()

    const auth =  getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        setUid(userCredential.user.uid)
        seturEmail(email)
        console.log(userCredential)
        setIsLoggedIn(true)
        localStorage.setItem("email",email)
        localStorage.setItem("uid",userCredential.user.uid)
        nav("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage)
      });

  }

  return (
    <div className="form-container">
      <h1>Login page</h1>
      <form className="login-form" onSubmit={signInUser}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>

        <Link to="/signup">Signup</Link>
      </form>
    </div>
  )
}

export default Login
