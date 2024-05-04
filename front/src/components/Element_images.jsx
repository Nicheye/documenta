import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Element_images = () => {
	const { id } = useParams();
  const [room, setRoom] = useState('');
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      window.location.href = '/login';
    } else {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `http://127.0.0.1:8000/api/v1/element_photo/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
          setRoom(data.room);
          setData(data.photos);
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
  }, [data]);


  const handleBackClick = () => {
    navigate(-1); // This navigates back one step in the history
  };


  const submit = async (e) => {
    e.preventDefault();
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    };
  
    try {
      for (const selectedImage of image) {
        const formData = new FormData();
        formData.append('photo', selectedImage);
        
        await axios.post(
          `http://127.0.0.1:8000/api/v1/element_photo/${id}`,
          formData,
          config
        );
      }
      
      setData([]); // Clear data after successful upload
      setImage([]); // Clear image state after successful upload
      fetchData(); // Fetch updated data after uploading images
    } catch (error) {
      console.log(error);
    }
  };
  
    

    

    const uploadImage = (e) => {
      const selectedImages = Array.from(e.target.files);
      setImage(selectedImages);
    };
    

  const delete_image = async(id) =>{
    try {
      const { data } = await axios.delete(`http://127.0.0.1:8000/api/v1/element_photo/${id}`);
       
      } catch (error) {
      console.log(error);
      }
  }
	return (
		<>
		  <div className="detail-update-screen">
			<div className="begining-banner">{room}</div>
	
			<div className="updating-wrapper">
			  <div className="preview-title">Images</div>
			  <div className="images-updating-grip">
				{data &&
				  data.map((photo) => (
          <div className="sign-card">

          
					<img
					  key={photo.id}
					  src={photo.photo}
					  alt=""
					  className="updating_photo"
					/>

          <div className="alr_room_del" onClick={e => delete_image(photo.id)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-x" viewBox="0 0 16 16">
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
					</svg>
				</div>
          </div>
				  ))}
			  </div>
	
			  <form action="" className="images-updating-form" onSubmit={submit}>
				<div class="mb-3">
				  <label  class="form-label">
					Pick image
				  </label>
				  <input
					name="photo"
					class="form-control form-control-sm"
					type="file"
					id="formFile"
					required
          multiple
					placeholder="Upload Water Data"
					onChange={uploadImage}
					accept="image/png, image/jpeg"
				  />
				</div>
	
				<button className="next-button images">Upload</button>
	
				<button onClick={handleBackClick} className='return-back-btn'> Return back</button>
			  </form>
			</div>
		  </div>
		</>
	  );
}

export default Element_images