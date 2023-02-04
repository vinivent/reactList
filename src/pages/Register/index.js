import { useState } from 'react'
import logo from '../Home/assets/logo.png'
import { Link } from 'react-router-dom'
import { auth } from '../../firebaseConnection'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/signed', { replace: true })
        })
        .catch(() => {
          console.log("ERRO AO FAZER O CADASTRO")
        })


    } else {
      alert("Preencha todos os campos!")
    }


  }


  return (
    <div className='container'>
      <div className='container-login'>
        <div className='wrap-login'>
          <form className='login-form' onSubmit={handleRegister}>
            <span className='login-form-title'>Sign up for free</span>
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
              <span className="txt1">Already registered?</span>
              <Link className='txt2' to="/"> Login </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}