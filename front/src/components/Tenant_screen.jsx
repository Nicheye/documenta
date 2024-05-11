
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Signature from './Signature';
import { useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Tenant_screen = (props) => {
	
  const navigate = useNavigate()

  const { id } = useParams();

  const [data,setData] = useState([]);

  const [user,setUser] = useState('');

  const [name,setName]= useState('');

  const [status,setStatus]= useState('tenant');

  const [email,setEmail] = useState('');
  
  useEffect(() => {
	const fetchData = async () => {
	  try {
		const { data } = await axios.get(
		  `http://127.0.0.1:8000/api/v1/ownership/${id}`,
		  {
			headers: {
			  'Content-Type': 'application/json'
			},
			withCredentials: true,
		  }
		);
		setData(data.data);
		setUser(data.user);
	  } catch (error) {
		console.log('not auth', error);
	  }
	};
  
	// Fetch data initially
	fetchData();
  
	// Fetch data every 2 seconds
	const interval = setInterval(fetchData, 2000);
  
	// Cleanup interval on component unmount
	return () => clearInterval(interval);
  }, [id]);
  

  const submit = async e =>{
    e.preventDefault()

    const ownership = {
      name:name,
	  status:status,
	  email:email
    
    };
// Create the POST requuest
const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
};

try {
  const { data } = await axios.post(`http://127.0.0.1:8000/api/v1/ownership/${id}`, ownership, config);
  setName('')
  setStatus('')

} catch (error) {
  console.log(error);
}
  }
  const click = e =>{
	navigate(`/file/${id}`); 
}
const delete_ten = async(id) =>{
	try {
		const { data } = await axios.delete(`http://127.0.0.1:8000/api/v1/ownership/${id}`);
		
	  } catch (error) {
		console.log(error);
	  }
}
  return (
	<>
	<div className="tenants-screen">
	<div className="begining-banner">{user}</div>

	<div className="tenant-form">

		<div className="alr_tenants_wrapper">
			{data.map(tenant => 
			<div className="sign-card">
				<div className="alr_tenant_del" onClick={e => delete_ten(tenant.id)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-x" viewBox="0 0 16 16">
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
					</svg>
				</div>
				<div className="alr_tenant_status">{tenant.status}</div>
				<img src={tenant.sign} alt="" className="sign-image" />
				<div className="alr_tenant_name">{tenant.name}</div>
			</div> )}
		</div>

		

		
		<Signature id={id}/>
		
		<button className="next-button" onClick={click}>Next</button>
	</div>
	</div>
	</>
  )
}

export default Tenant_screen