
import { useState } from 'react'
import './home.css'
import logo from './assets/logo.png'
import { Link } from 'react-router-dom'

import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/signed', { replace: true })
        })
        .catch(() => {
          console.log("ERRO AO FAZER O LOGIN")
        })

    } else {
      alert("Preencha todos os campos!")
    }


  }


  return (
    <div className='container'>
      <div className='container-login'>
        <div className='wrap-login'>
          <form className='login-form' onSubmit={handleLogin}>
            <span className='login-form-title'>Organize your tasks!</span>
            <span className='login-form-title'><img src={logo} alt="" /></span>

            <div className='wrap-input'>
              <input className={email !== "" ? 'has-value input' : 'input'} type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <span className="focus-input" data-placeholder='Email'></span>

            </div>

            <div className='wrap-input'>
              <input className={password !== "" ? 'has-value input' : 'input'} type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <span className="focus-input" data-placeholder='Email'></span>
            </div>

            <div className="container-login-form-btn">
              <button className='login-form-btn' type='submit'>Login</button>
            </div>
            <div className="text-center">
              <span className="txt1">Don't have an account?</span>
              <Link className='txt2' to="/register"> Sign Up </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
