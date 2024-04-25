import React, { useState, useEffect} from 'react';

import {Link} from 'react-router-dom'
import logo from '../assets/logo_mobile.png'
const Navigate = () => {
	const [isAuth,setIsAuth] = useState(false)
	useEffect(() => {
		if(localStorage.getItem('access_token') !== null){
			setIsAuth(true);
		}
	},[isAuth]);
  return (

  <>
  {/* <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        
        

        {isAuth ? <Link to="/" className='nav-link active'>Home</Link> : null}
        {isAuth ? <Link to="/logout" className='nav-link active'>Logout</Link> :
                  
                  
                  <Link to="/login" className='nav-link active'>Login</Link>}
        {isAuth ? '.' :
                  
                  
                  <Link to="/register" className='nav-link active'> Register</Link>}
                  
                  
      </ul>
    
    </div>
  </div>
</nav> */}
   <div className="header">
    <Link to={'/'} className="header-logo"></Link>
   </div>
  </>       
  )
}

export default Navigate