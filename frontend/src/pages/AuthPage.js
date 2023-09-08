import React, { useContext, useState } from 'react';
import './AuthPage.css';
import authContext from '../context/auth-context';

export default function AuthPage() {
  const email = React.createRef();
  const password = React.createRef();
  const { token, login } = useContext(authContext);
  const [islogin, setLogin] = useState(true);

  const switchHandler = e => {
    return setLogin(!islogin);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const emailVal = email.current.value;
    const passwordVal = password.current.value;
    if (emailVal.trim().length === 0 || passwordVal.trim().length === 0) {
      return;
    }

    // if user is login
    let requestBody = {
      query: `
        query Login($Email: String!, $Password: String!){
          login (email: $Email, password: $Password) {
            userID
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        Email: emailVal,
        Password: passwordVal
      }
    };

    // For signup user
    if (!islogin) {
      requestBody = {
        query: `
          mutation CreateUser($Email: String!, $Password: String!){
            createUser (inputUser: {email: $Email, password: $Password}) {
              _id
              email
            }
          }
        `,
        variables: {
          Email: emailVal,
          Password: passwordVal
        }
      }
    }

    fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(res => {
        if (res.data.login.token) {
          login(res.data.login.token, res.data.login.tokenExpiration, res.data.login.userID);
        }
      })
      .catch(err => {
        console.log("error:", err);
      });
  }

  return (
    <form className='auth-form' onSubmit={submitHandler}>
      {token ? token.split('.')[1] : ''}
      <div className='form-control'>
        <label htmlFor="email">E-mail: </label>
        <input type="text" id="email" placeholder='Required' ref={email} />
      </div>
      <div className='form-control'>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" placeholder='Required' ref={password} />
      </div>
      <div className='form-actions'>
        <button type='submit' >Submit</button>
        <button type='button' onClick={switchHandler}>Switch to {islogin ? 'Signup' : 'Signin'}</button>
      </div>
    </form>
  )
}
