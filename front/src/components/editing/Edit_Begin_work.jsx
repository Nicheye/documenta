import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { redirect } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Edit_Keys_screen from './Edit_Keys_screen';
import { useParams } from 'react-router-dom';
const  Edit_Begin_work = () => {
  const navigate = useNavigate();
  const userAgent = navigator.userAgent;
  const { id } = useParams();

  
  const [acts,setActs] = useState([]);
  const [act,setAct] = useState(1);
  const [user,setUser] = useState([]);
  const [country,setCountry] = useState('');
  const [city,setCity] = useState('');
  const [street,setStreet] = useState('');
  const [building,setBuilding] = useState('');
  const [apartment,setApartment] = useState('');
  
  const [water_image,SetWaterImage] = useState([]);
  const [water_text,setWater_text] = useState('');
  const [elictric_image,SetElitcricImage] = useState([]);
  const [electric_text,setElec_text] = useState('');
  const [gas_image,SetGasImage] = useState([]);
  const [gas_text,setGas_text] = useState('');
  const [previousdata,setPrevData] = useState([]);
  

	const detectDevice = () => {
    const userAgent = navigator.userAgent;
  
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      return "iOS";
    } else if (/Android/.test(userAgent)) {
      return "Android";
    } else {
      return "Unknown";
    }
  };
  
  const [device, setDevice] = useState(detectDevice());
  
  useEffect(() => {
    if(localStorage.getItem('access_token') ===null){
      window.location.href = '/login'

    }
    else{
      (async () =>{
        try{
          const {data} = await axios.get(
            `http://127.0.0.1:8000/api/v1/act/${id}`,{
              headers:{
                'Content-Type':'application/json'
              },
              withCredentials:true,
            }
          );
          const {clean} = await axios.get(
            `http://127.0.0.1:8000/api/v1/clean_document/${id}`,{
              headers:{
                'Content-Type':'application/json'
              },
              withCredentials:true,
            }
          );
          setActs(data.acts);
          setUser(data.user);
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
      act:act,
	  country:country,
      city:city,
	  street:street,
	  building:building,
	  apartment:apartment,
	  device:device,
    water:water_image.pictureAsFile,
    water_text:water_text,
    elictiricity_text:electric_text,
    elictricity:elictric_image.pictureAsFile,
    gas:gas_image.pictureAsFile,
    gas_text:gas_text,
    
    };
// Create the POST requuest
const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
};

try {
  const { data } = await axios.patch(`http://127.0.0.1:8000/api/v1/act/${id}`, user, config);
  // const id = data.data.id;
   // Navigate to '/next-screen/:id' route
} catch (error) {
  console.log(error);
}
  }

  const uploadWaterPicture = (e) => {
    SetWaterImage({
      /* contains the preview, if you want to show the picture to the user
         you can access it with this.state.currentPicture
       */
      picturePreview : URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile : e.target.files[0]
    })
  };

  const uploadElictricPicture = (e) => {
    SetElitcricImage({
      /* contains the preview, if you want to show the picture to the user
         you can access it with this.state.currentPicture
       */
      picturePreview : URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile : e.target.files[0]
    })
  };

  const uploadGasPicture = (e) => {
    SetGasImage({
      /* contains the preview, if you want to show the picture to the user
         you can access it with this.state.currentPicture
       */
      picturePreview : URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile : e.target.files[0]
    })
  };

  const next_click = e =>{
    navigate(`/condition_screen/${id}`);
  }
  return (
    <>
      <div className="begining-screen">
        <div className="begining-banner">{user.username}</div>
     

      <div className="begin_form edit">
    <div className="begin-title">1. Beginning of work</div>

    <form action="" onSubmit={submit} className='begin_work_form' enctype="multipart/form-data" >
    <label for="formFile" class="form-label">Act</label>
	<select className="begin_work_select" 
			  placeholder="Choice of act" 
			   value={act}
			  
			  onChange={e => setAct(e.target.value)}
			  >

			{acts.map(act =>
				
				<option value={act.id}><div className="begin-option">{act.name}</div></option>
				
			)}
			
	</select>

  <label for="formFile" class="form-label">Country</label>
	<input className="work_input" 
             placeholder={previousdata.country} 
             name='country'  
             type='text' value={country}
             
             onChange={e => setCountry(e.target.value)}/>

<label for="formFile" class="form-label">City</label>
	<input className="work_input" 
            placeholder={previousdata.city}
             name='city'  
             type='text' value={city}
            
             onChange={e => setCity(e.target.value)}/>

<label for="formFile" class="form-label">Street</label>      
	<input className="work_input" 
             placeholder={previousdata.street}
             name='street'  
             type='text' value={street}
             
             onChange={e => setStreet(e.target.value)}/>

<label for="formFile" class="form-label">Building</label>
	<input className="work_input" 
             placeholder={previousdata.building}
             name='building'  
             type='text' value={building}
             
             onChange={e => setBuilding(e.target.value)}/>

	<label for="formFile" class="form-label">Apartment</label>
	<input className="work_input" 
             placeholder={previousdata.apartment}
             name='apartment'  
             type='text' value={apartment}
              
             onChange={e => setApartment(e.target.value)}/>



<div class="mb-3">  
<label for="formFile" class="form-label">Water</label>
  <input name='photo_condition' class="form-control form-control-sm" type="file" id="formFile" 
		
		placeholder='Upload Water Data'
		onChange={uploadWaterPicture} accept="image/png, image/jpeg" />
  
  <input className="work_input mb" 
             placeholder={previousdata.water_text}
             name='water data'  
             type='text' value={water_text}
              
             onChange={e => setWater_text(e.target.value)}/>
</div>

<div class="mb-3">  
<label for="formFile" class="form-label">Elictricity</label>
  <input name='photo_condition' class="form-control form-control-sm" type="file" id="formFile" 
		
		placeholder='Upload Elictricity Data'
		onChange={uploadElictricPicture} accept="image/png, image/jpeg" />
  
  <input className="work_input mb" 
             placeholder={previousdata.elictiricity_text}
             name='elictricity data'  
             type='text' value={electric_text}
              
             onChange={e => setElec_text(e.target.value)}/>
</div>


<div class="mb-3">  
<label for="formFile" class="form-label">Gas</label>
  <input name='photo_condition' class="form-control form-control-sm" type="file" id="formFile" 
		
		placeholder='Upload Elictricity Data'
		onChange={uploadGasPicture} accept="image/png, image/jpeg" />
  
  <input className="work_input mb" 
             placeholder={previousdata.gas_text}
             name='gas data'  
             type='text' value={gas_text}
              
             onChange={e => setGas_text(e.target.value)}/>
</div>
<button className="condition-save-btn">save</button>

	
    </form>
    <Edit_Keys_screen id={id}/>
    <button className="next-button" onClick={next_click}>Next</button>
    </div>
    </div>
    </>
  )
}

export default Edit_Begin_work