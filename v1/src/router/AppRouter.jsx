import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import NavBar from '../components/NavBar'



export const AppRouter = () => {


  return (
    
    <>
    <BrowserRouter>
  <NavBar/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>

    </>
  )
}
