import { useState } from 'react'
import Create_Begin_work from './components/Create_Begin_work';
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./components/Login";
import Home from './components/Home1';
import Logout from './components/Logout';
import Navigate from './components/Navigate'
import Condition_add from './components/Condition_add';
import Finalizing from './components/Finalizing';
import Register from './components/Register';
import Preview_screen from './components/Preview_screen';
import Keys_screen from './components/Keys_screen';
import Tenant_screen from './components/Tenant_screen';
import Element_screen from './components/Element_screen';
import Element_images from './components/Element_images';
import File_screen from './components/File_screen';
import Edit_Keys_screen from './components/editing/Edit_Keys_screen';
import Edit_Begin_work from './components/editing/Edit_Begin_work'

function App() {
 

  return (
    <BrowserRouter>
        <Navigate/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/create_begin" element={<Create_Begin_work/>}/>
          <Route path="/condition_screen/:id" element={<Condition_add/>}/>
          <Route path="/keys_screen/:id" element={<Keys_screen/>}/>
          
          <Route path="/finalizing/:id" element={<Finalizing/>}/>
          <Route path="/tenants/:id" element={<Tenant_screen/>}/>
          <Route path="/preview/:id" element={<Preview_screen/>}/>
          <Route path="/file/:id" element={<File_screen/>}/>
          <Route path="/elements/:id" element={<Element_screen/>}/>
          <Route path="/elements_image/:id" element={<Element_images/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>

          <Route path="/edit_begin/:id" element={<Edit_Begin_work/>}/>
          
          
         
        </Routes>
      </BrowserRouter>
  
  )
}

export default App
