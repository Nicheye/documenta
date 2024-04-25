import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Signature from './Signature';
import { useEffect } from 'react';
import axios from 'axios'
const Finalizing = () => {

 const { id } = useParams();
 const [user,setUser] = useState([])
 const [signs,setDoc] = useState([])
 const navigate = useNavigate()
 useEffect(() => {
  if (localStorage.getItem('access_token') === null) {
    window.location.href = '/login';
  } else {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/v1/signs/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        setDoc(data.data);
        setUser(data.user);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    const delay = 1000; // Set the delay in milliseconds

    const debounceFetchData = setTimeout(() => {
      fetchData();
    }, delay);

    return () => clearTimeout(debounceFetchData);
  }
}, [signs]);
const click = e =>{
  navigate(`/file/${id}`)
}
  return (
	<>
	<div className="finalizing-screen">
	<div className="begining-banner">{user}</div>

	<div className="finalizing-wrapper">
	<div className="preview-title">2. Preview</div>

  <div className="signs-wrapper">

    {signs.map(sign =>
    <div className="sign-card">
      <img src={sign.sign} alt="" className="sign-image" />
      <div className="sign-label">{sign.author}</div>
    </div> )}

  </div>
	{/* <a href={doc.document} download>download file</a> */}
	
  <button className="next-button" onClick={click}>Next</button>
	</div>
	</div>
	</>
  )
}

export default Finalizing