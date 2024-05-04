import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
const Element_screen = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [elements,setElements] = useState([])
  const [user,setUser] = useState('')

  const [name,setName] = useState('floors');
  const [comments,setComments] = useState('');

  useEffect(() => {
    if(localStorage.getItem('access_token') ===null){
      window.location.href = '/login'

    }
    else{
      (async () =>{
        try{
          const {data} = await axios.get(
            `http://127.0.0.1:8000/api/v1/element/${id}`,{
              headers:{
                'Content-Type':'application/json'
              },
              withCredentials:true,
            }
          );
          setElements(data.data);
          setUser(data.user);
        }
        catch (e){
          console.log('not auth')
        }
      })()};
  },[]);

  const handleBackClick = () => {
    navigate(-1); // This navigates back one step in the history
  };

  const submit = async e =>{
    e.preventDefault()

    const element = {
      name:name,
      comments:comments
    };
// Create the POST requuest
const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
};

try {
  const { data } = await axios.post(`http://127.0.0.1:8000/api/v1/element/${id}`, element, config);
  const new_id = data.data.id
  navigate(`/elements_image/${new_id}`); // Navigate to '/next-screen/:id' route
} catch (error) {
  console.log(error);
}
  }

  const delete_elem = async(id) =>{
    try {
      const { data } = await axios.delete(`http://127.0.0.1:8000/api/v1/element/${id}`);
       // Navigate to '/next-screen/:id' route
      } catch (error) {
      console.log(error);
      }
  }
  return (
	<>
  <div className="element-screen">
  <div className="begining-banner">{user}</div>

  <div className="elements-wrapper">
  <div className="condition-title">Already Elements</div>
    {elements.map(element =>
    <div className="element-item elem_1">
      <div className="alr_room_del elem" onClick={e => delete_elem(element.id)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-x" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
    </svg>
  </div>
      <Link className='elem_link' to={`/elements_image/${element.id}`} >
       {element.name}
      
    </Link>
    
    </div>
     )}
  </div>

  <form action="" className="tenant-form-form elem" onSubmit={submit} >

		<label  class="form-label">Part</label>
		<select className="begin_work_select" 
				placeholder="Status" 
				value={name}
				 
				onChange={e => setName(e.target.value)}
				>
				<option value='Floors'><div className="begin-option">Floors</div></option>
				<option value='Walls'><div className="begin-option">Walls</div></option>
				<option value='Celling'><div className="begin-option">Celling</div></option>
        <option value='Windows'><div className="begin-option">Windows</div></option>
        <option value='Furniture'><div className="begin-option">Furniture</div></option>
        <option value='Other'><div className="begin-option">Other</div></option>
						
		</select>

		<label  class="form-label">Comments</label>
		<textarea className="work_input text_area" 
				placeholder="Comments" 
				name='Comments'  
				type='text' value={comments}
				 
				onChange={e => setComments(e.target.value)}/>
		<button  class="condition-close-btn tenant" >Add</button>
		</form>

  <button onClick={handleBackClick} className='return-back-btn elem'> Return back</button>
  </div>
  </>
  )
}

export default Element_screen