
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Signature from './Signature';
import { useEffect } from 'react';
import axios from 'axios'
const File_screen = () => {
	const { id } = useParams();
	const [user,setUser] = useState([])
	const [doc,setDoc] = useState([])
	useEffect(() => {
	 if (localStorage.getItem('access_token') === null) {
	   window.location.href = '/login';
	 } else {
	   const fetchData = async () => {
		 try {
		   const { data } = await axios.get(
			 `http://127.0.0.1:8000/api/v1/files/${id}`,
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
   }, [doc]);
   
	 return (
	   <>
	   <div className="finalizing-screen">
	   <div className="begining-banner">{user.username}</div>
   
	   <div className="finalizing-wrapper">
	   <div className="preview-title">2. Preview</div>
   
	 
	   <a href={doc.document} download>download file</a>
	   
	   </div>
	   </div>
	   </>
	 )
}

export default File_screen