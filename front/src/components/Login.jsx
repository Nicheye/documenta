import React,{useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
// Define the Login function.
const Login = () => {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
// Create the submit method.
  const submit = async e =>{
    e.preventDefault()

    const user = {
      username:username,
      password:password
    };
// Create the POST requuest
const config = {
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
};

const { data } = await axios.post('http://127.0.0.1:8000/token/', user, config);
  localStorage.clear();
  console.log(data.access)
  localStorage.setItem('access_token',data.access);
  localStorage.setItem('refresh_token',data.refresh);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
  window.location.href = '/'
  }

  return (

  <>
  <div className="auth-login">
  <div className="access-banner">Personal Access</div>

  <div className="auth_form">
    <div className="auth-title">Login</div>
    <form action="" className='auth_inputs' onSubmit={submit} >

    
           
           <input className="auth_input" 
             placeholder="Username" 
             name='username'  
             type='text' value={username}
             required 
             onChange={e => setUsername(e.target.value)}/>
         
         
           <input name='password' 
             type="password"     
             className="auth_input"
             placeholder="password"
             value={password}
             required
             onChange={e => setPassword(e.target.value)}/>
       

         <button className="auth-btn">Login</button>
        
         <Link to={'/register'} className="logout-btn">Register</Link>
    </form>
  </div>
  </div>
  </>
  )
}

export default Login