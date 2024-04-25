import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
const Condition_add = (props) => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [conditions,setConditions] = useState([])
  const [user,setUser] = useState([])
  useEffect(() => {
    if (localStorage.getItem('access_token') === null) {
      window.location.href = '/login';
    } else {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `http://127.0.0.1:8000/api/v1/rooms/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
          setConditions(data.data);
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
  }, [conditions]);

  const click = () =>{
    navigate(`/file/${id}`)
  }

  const click_element = async(name) => {
    const room = {
      room:name
    };
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    };
    try {
      const { data } = await axios.post(`http://127.0.0.1:8000/api/v1/rooms/${id}`, room, config);
      const elemtend_id = data.data.id;
      navigate(`/elements/${elemtend_id}`) // Navigate to '/next-screen/:id' route
    } catch (error) {
      console.log(error);
    }

    
  }
  const handleBackClick = () => {
    navigate(-1); // This navigates back one step in the history
  };

  const delete_cond = async(id) =>{
    try {
      const { data } = await axios.delete(`http://127.0.0.1:8000/api/v1/detail/${id}`);
       
      } catch (error) {
      console.log(error);
      }
  }
  return (
	<>
  
  <div className="add-condition-screen">
  <div className="begining-banner">{user}</div>
  
  <div className="condition-screen">
    <div className="condition-title">2. Condition</div>

    <div className="alr_rooms-wrapper">
    <label  class="form-label">Already added</label>
      {conditions.map(room =>
      <div className="room-wrapper">
        <div className="alr_room">
        <Link to={`/elements/${room.id}`} className='del_link'>{room.room}</Link>

        <div className="alr_room_del" onClick={e => delete_cond(room.id)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-x" viewBox="0 0 16 16">
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
					</svg>
				</div>
        </div>
        
        
      </div>
      )}
    </div>
    
    <div className="suggestion_rooms">
    <label  class="form-label suggest">You can also Add</label>
    
    <div className="suggest_room_option" onClick={e => click_element('Hall')}>Hall</div>
    <div className="suggest_room_option" onClick={e => click_element('Living Room')}>Living Room</div>
    <div className="suggest_room_option" onClick={e => click_element('Kitchen')} >Kitchen</div>
    <div className="suggest_room_option" onClick={e => click_element('Bedroom 1')}>Bedroom 1 </div>
    <div className="suggest_room_option" onClick={e => click_element('Bedroom 2')} >Bedroom 2 </div>
    <div className="suggest_room_option" onClick={e => click_element('Bedroom 3')}>Bedroom 3 </div>
    <div className="suggest_room_option" onClick={e => click_element('Bedroom 4')}>Bedroom 4 </div>
    <div className="suggest_room_option" onClick={e => click_element('Bedroom 5')} >Bedroom 5 </div>
    <div className="suggest_room_option" onClick={e => click_element('Other')} >Other </div>

    </div>
    <button onClick={handleBackClick} className='return-back-btn elem'> Return back</button>
    <button className="next-button" onClick={click}>Next</button>
  </div>

  </div>
  </>
  )
}

export default Condition_add