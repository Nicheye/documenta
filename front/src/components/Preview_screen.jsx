import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mammoth from 'mammoth';
import { useNavigate } from 'react-router-dom';
const Preview_Screen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [docContent, setDocContent] = useState('');
  const [error, setError] = useState('');
  const [doc,setDoc] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/preview/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        setUser(data.user);
		setDoc(data.data)
        const response = await axios.get(data.data.preview, {
          responseType: 'arraybuffer',
        });

        const result = await mammoth.convertToHtml({ arrayBuffer: response.data });
        setDocContent(result.value);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
        fetchData()
      }
    };

    fetchData();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1) // Navigate back one step in the history
  };

  const handleClick = () => {
    navigate(`/tenants/${id}`);
  };

  return (
    <div className="finalizing-screen">
       <div className="begining-banner">{user.username}</div>

      <div className="finalizing-wrapper">
        <div className="preview-title">2. Preview</div>

        {error && <p>{error}</p>}
        
        <a href={doc.preview} download>Download File</a>

        <div className='doc_content' dangerouslySetInnerHTML={{ __html: docContent }} />

        <button className='return-back-btn elem' onClick={handleBackClick}>Return Back</button>
        <button className="next-button" onClick={handleClick}>Next</button>
      </div>
    </div>
  );
};

export default Preview_Screen;
