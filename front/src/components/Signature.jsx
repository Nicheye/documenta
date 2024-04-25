import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom

const Signature = (props) => {
  const id = props.id;
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const navigate = useNavigate();
  const [name,setName] = useState('');
  const [status,setStatus] = useState('tenant');

  const [email,setEmail] = useState('')


  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (event.type === 'mousedown' || event.type === 'mousemove') {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else if (event.type === 'touchstart' || event.type === 'touchmove') {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (event.type === 'mousemove') {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else if (event.type === 'touchmove') {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    
    // Get the data URL of the canvas content (as PNG)
    const dataURL = canvas.toDataURL('image/png');
    
    // Extract the base64-encoded image data
    const imageData = dataURL.split(',')[1]; // Remove the 'data:image/png;base64,' prefix
    
    // Convert the base64 string to a Blob
    const blob = b64toBlob(imageData, 'image/png');
    
    // Create a FormData object
    const formData = new FormData();
    
    // Append the Blob to the FormData object with a specified filename
    formData.append('name',name);
    formData.append('doc',id);
    formData.append('sign', blob, 'signature.png');
    formData.append('email',email);
    formData.append('status',status)
   

    // Set up the Axios config
    const config = {
      headers: {
      'Content-Type': 'multipart/form-data' 
      },
      withCredentials: true
    };
    
    try {
      
      // Make the POST request to your backend server with the FormData
      const response = await axios.post(`http://127.0.0.1:8000/api/v1/ownership/${id}`, formData, config );
      console.log(response.data)
      setName('')
      clearCanvas()
      setEmail('')
    } catch (error) {
      
      console.error('Error saving signature:', error);
    }
    };
    
    // Function to convert a base64 string to a Blob
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
    
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
      }
    
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
    };

  return (
    <form className='signature_form' onSubmit={saveSignature}>
      
      
      <label  class="form-label">Status</label>
		<select className="begin_work_select" 
				placeholder="Status" 
				value={status}
				required 
				onChange={e => setStatus(e.target.value)}
				>
				<option value='tenant'><div className="begin-option">tenant</div></option>
				<option value='landlord'><div className="begin-option">landlord</div></option>
				<option value='owner'><div className="begin-option">owner</div></option>
						
		</select>

		<label  class="form-label">Name</label>
		<input className="work_input" 
				placeholder="Name" 
				name='Name'  
				type='text' value={name}
				required 
				onChange={e => setName(e.target.value)}/>
		
		<label className="form-label">Email</label>
    <input 
      className="work_input" 
      type="email" 
      placeholder="Enter your email" 
      name="email" 
      value={email} 
      required 
      onChange={e => setEmail(e.target.value)}
    />

        <canvas
        ref={canvasRef}
        width={220}
        height={200}
        style={{ border: '1px solid black' }}
        className='signature_pad'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />

    
    <button className='condition-close-btn' onClick={clearCanvas} type='button'>Clear</button>
      <button className='condition-save-btn' type='submit'>Save</button>
    </form>
  );
};

export default Signature;
