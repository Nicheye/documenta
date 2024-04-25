import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Home = () => {
  const [user, setUser] = useState([]);
  const [active_acts, setActiveActs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('access_token') === null) {
      window.location.href = '/login';
    } else {
      (async () => {
        try {
          const { data } = await axios.get(
            'http://127.0.0.1:8000/api/v1/user_home',
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );

          setUser(data.user);
          setActiveActs(data.active_acts);
          setDrafts(data.drafts_acts);
          setIsLoading(false); // Set isLoading to false when data is fetched
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      })();
    }
  }, []);

  if (isLoading) {
    return <div className='home-screen'>Loading...</div>; // Show loading message while data is fetched
  }

  const delete_docs = async(id) =>{
    try {
      const { data } = await axios.delete(`http://127.0.0.1:8000/api/v1/act/${id}`);
       
      } catch (error) {
      console.log(error);
      }
  }
  return (
    <div className="home-screen">
      <div className="begining-banner">{user.username}</div>
      <div className="home-wrapper">
        <Link to={'/create_begin'} className='start-btn'>Create Act</Link>
        
        <div className="acts-wrapper">
          <div className="active-act-title">Active acts <div className="gp"></div></div>
          {active_acts.map(act =>
          <div className="act-item">
             
            <Link to={`/file/${act.id}`} >
              <div className="left-act-item">{act.city} , {act.street} , {act.building}</div>
              <div className="right-act-item">{act.created_at}</div>
            </Link>
            

            <div className="alr_room_del main" onClick={e => delete_docs(act.id)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-x" viewBox="0 0 16 16">
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
					</svg>
				</div> 

          </div>
          )}

      <div className="active-act-title">Drafts <div className="rp"></div></div>
      {drafts.map(draft =>
            <div className="act-item">
              

          <Link to={`/edit_begin/${draft.id}`} className="act-item">
              <div className="left-act-item">{draft.city} , {draft.street} , {draft.building}</div>
              <div className="right-act-item">{draft.created_at}</div>
            </Link>

            <div className="alr_room_del main" onClick={e => delete_docs(draft.id)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-x" viewBox="0 0 16 16">
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
					</svg>

				  </div>
            </div>
            
          )}
        </div>

        <Link to={'/logout'} className="logout-btn">logout</Link>
        </div>
    </div>
  );
};

export default Home;
