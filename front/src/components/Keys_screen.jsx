import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

const Keys_screen = (props) => {
	
  const navigate = useNavigate()
  const { id } = useParams();
  const [keys_image,setKeysImage] = useState([]);
  const [door,setDoor] = useState('');
  const [mailbox,setMailbox] = useState('');
  const [k_from_b,setK_from_b] = useState(''); 
//   Keys from the building 
//   entrance
  const [parking,setParking] = useState('');
  const [remote_contrls,setRemote_contrls] = useState('');
  const [ac_controls,setAc_controls] = useState('');
  const [comments,setComments] = useState('');

  const submit = async e =>{
    e.preventDefault()

    const user = {
      doc:id,
	  comments:comments,
	  ac_controls:ac_controls,
	  remote_contrls:remote_contrls,
	  parking:parking,
	  k_from_b:k_from_b,
	  mailbox:mailbox,
	  door:door,
	  keys_image:keys_image.pictureAsFile
    };
// Create the POST requuest
const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
};

try {
  const { data } = await axios.post('http://127.0.0.1:8000/api/v1/keys/', user, config);
  
  navigate(`/tenants/${id}`); // Navigate to '/next-screen/:id' route
} catch (error) {
  console.log(error);
}
  }
  const uploadKeysPicture = (e) => {
    setKeysImage({
      /* contains the preview, if you want to show the picture to the user
         you can access it with this.state.currentPicture
       */
      picturePreview : URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile : e.target.files[0]
    })
  };


  return (
	<>
	<div className="begining-screen">
        <div className="begining-banner">Keys</div>
	

	<div className="begin_form">
    <div className="begin-title">1. Beginning of work</div>
	<form action="" onSubmit={submit} className='begin_work_form' enctype="multipart/form-data" >
	
	<div class="mb-3">  
<label  class="form-label">Keys Photo</label>
  <input name='photo_condition' class="form-control form-control-sm" type="file" id="formFile" 
		
		placeholder='Upload Water Data'
		onChange={uploadKeysPicture} accept="image/png, image/jpeg" />
</div>

<label  class="form-label">Entrance Door</label>
<input className="work_input" 
             placeholder="Apartment entrance door" 
             name='apartment'  
             type='text' value={door}
              
             onChange={e => setDoor(e.target.value)}/>

<label  class="form-label">Mailbox</label>
<input className="work_input" 
             placeholder="Mailbox" 
             name='apartment'  
             type='text' value={mailbox}
              
             onChange={e => setMailbox(e.target.value)}/>

<label  class="form-label">Keys from the building</label>
<input className="work_input" 
             placeholder="Keys from the building 
			 entrance" 
             name='apartment'  
             type='text' value={k_from_b}
              
             onChange={e => setK_from_b(e.target.value)}/>

<label  class="form-label">Garage / parking</label>
<input className="work_input" 
             placeholder="Garage / parking" 
             name='apartment'  
             type='text' value={parking}
              
             onChange={e => setParking(e.target.value)}/>

<label  class="form-label">Remote controls</label>
<input className="work_input" 
             placeholder="Remote controls" 
             name='apartment'  
             type='text' value={remote_contrls}
              
             onChange={e => setRemote_contrls(e.target.value)}/>

<label  class="form-label">AC remote controls</label>
<input className="work_input" 
             placeholder="AC remote controls" 
             name='apartment'  
             type='text' value={ac_controls}
              
             onChange={e => setAc_controls(e.target.value)}/>

<label  class="form-label">Comments on condition</label>
<textarea className="work_input text_area" 
             placeholder="Comments" 
             name='apartment'  
             type='text' value={comments}
              
             onChange={e => setComments(e.target.value)}/>


<button className="next-button">Next</button>
	</form>
	</div>
	</div>
	</>
  )
}

export default Keys_screen