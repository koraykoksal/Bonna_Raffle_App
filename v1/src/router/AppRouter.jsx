import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import NavBar from '../components/NavBar'
import AdminLogin from '../components/AdminLogin'
import PrivateRouter from './PrivateRoute'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import EtkinlikDetail from '../pages/EtkinlikDetail'



export const AppRouter = () => {


  return (

    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='/:id' element={<EtkinlikDetail />} />
          <Route element={<PrivateRouter />}>
            <Route path='/admin' element={<Admin />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}
