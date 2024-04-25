import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

const Edit_Keys_screen = (props) => {
	
  const navigate = useNavigate()
  const  id =props.id;
  const [keys_image,setKeysImage] = useState([]);
  const [door,setDoor] = useState('');
  const [mailbox,setMailbox] = useState('');
  const [k_from_b,setK_from_b] = useState(''); 

  const [parking,setParking] = useState('');
  const [remote_contrls,setRemote_contrls] = useState('');
  const [ac_controls,setAc_controls] = useState('');
  const [comments,setComments] = useState('');
  const [prevData,setPrevData] = useState([]);
  useEffect(() => {
    if(localStorage.getItem('access_token') ===null){
      window.location.href = '/login'

    }
    else{
      (async () =>{
        try{
          const {data} = await axios.get(
            `http://127.0.0.1:8000/api/v1/keys/${id}`,{
              headers:{
                'Content-Type':'application/json'
              },
              withCredentials:true,
            }
          );
          setPrevData(data.data)
          
        }
        catch (e){
          console.log('not auth')
        }
      })()};
  },[]);

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
  const { data } = await axios.patch(`http://127.0.0.1:8000/api/v1/keys/${id}`, user, config);
  
   // Navigate to '/next-screen/:id' route
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

	<div className="begin_form edit_keys">
    <div className="begin-title edit">Keys</div>
	<form action="" onSubmit={submit} className='begin_work_form' enctype="multipart/form-data" >
	
	<div class="mb-3">  
<label for="formFile" class="form-label">Keys Photo</label>
  <input name='photo_condition' class="form-control form-control-sm" type="file" id="formFile" 
		
		placeholder='Upload Water Data'
		onChange={uploadKeysPicture} accept="image/png, image/jpeg" />
</div>

<label for="formFile" class="form-label">Entrance Door</label>
<input className="work_input" 
             placeholder={prevData.door}
             name='apartment'  
             type='text' value={door}
             required 
             onChange={e => setDoor(e.target.value)}/>

<label for="formFile" class="form-label">Mailbox</label>
<input className="work_input" 
             placeholder={prevData.mailbox} 
             name='apartment'  
             type='text' value={mailbox}
             required 
             onChange={e => setMailbox(e.target.value)}/>

<label for="formFile" class="form-label">Keys from the building</label>
<input className="work_input" 
             placeholder={prevData.k_from_b}  
             name='apartment'  
             type='text' value={k_from_b}
             required 
             onChange={e => setK_from_b(e.target.value)}/>

<label for="formFile" class="form-label">Garage / parking</label>
<input className="work_input" 
             placeholder={prevData.parking}
             name='apartment'  
             type='text' value={parking}
             required 
             onChange={e => setParking(e.target.value)}/>

<label for="formFile" class="form-label">Remote controls</label>
<input className="work_input" 
             placeholder={prevData.remote_contrls} 
             name='apartment'  
             type='text' value={remote_contrls}
             required 
             onChange={e => setRemote_contrls(e.target.value)}/>

<label for="formFile" class="form-label">AC remote controls</label>
<input className="work_input" 
            placeholder={prevData.ac_controls} 
             name='apartment'  
             type='text' value={ac_controls}
             required 
             onChange={e => setAc_controls(e.target.value)}/>

<label for="formFile" class="form-label">Comments on condition</label>
<textarea className="work_input text_area" 
             placeholder={prevData.comments} 
             name='apartment'  
             type='text' value={comments}
             required 
             onChange={e => setComments(e.target.value)}/>


<button className="condition-save-btn">save</button>
	</form>
	</div>
	
	</>
  )
}

export default Edit_Keys_screen